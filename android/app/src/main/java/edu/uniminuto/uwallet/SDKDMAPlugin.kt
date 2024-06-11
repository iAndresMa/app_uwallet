package com.example.sdkdma

import android.os.Handler
import android.os.Looper
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.dorlet.mobileaccess.sdk.MobileAccessContext
import com.dorlet.mobileaccess.sdk.domain.AccessAttemptResultInfo
import com.dorlet.mobileaccess.sdk.domain.BindResultInfo
import com.dorlet.mobileaccess.sdk.domain.ButtonReaderInfo
import com.dorlet.mobileaccess.sdk.interfaces.DmaEventListener
import com.getcapacitor.annotation.CapacitorPlugin
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.Response
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.CompletableFuture

@CapacitorPlugin(name = "SDKDMAPlugin")
class SDKDMAPlugin : Plugin() {

  private var currentCall: PluginCall? = null
  private var accessAttemptFuture: CompletableFuture<String>? = null

  val dmaEventListener = object : DmaEventListener {
    override fun onAccessAttemptResult(p0: AccessAttemptResultInfo) {
      println("access attempt ${p0.result}")
      accessAttemptFuture?.complete(p0.result.toString())
    }

    override fun onCredentialCreated(p0: String?) {
      println("Credential created")
    }

    override fun onCredentialUpdated(p0: String?) {
      println("Credential updated")
    }

    override fun onCredentialDeleted(p0: String?) {
      println("Credential delete")
    }

    override fun onBindResult(p0: BindResultInfo?) {
      println("ONBIND: ${p0?.result}")
      accessAttemptFuture?.complete(p0?.result.toString())
    }
  }

  private var mobileAccessContext: MobileAccessContext = MobileAccessContext.init(dmaEventListener)
  // private val url: String = "http://10.0.26.189:8081/DASS/AccessControl/Acreditations/F0000011/DMAInviteCode"
  private val url: String = "http://10.0.26.189:8081/DASS/AccessControl/Acreditations/CODEINVITACION/DMAInviteCode"
  private val key: String = "Authorization"
  private val baseValue: String = "Basic SW50ZWdyYWNpb25lczpJbnRlZypSM3N0"
  private var readerButton: ArrayList<ButtonReaderInfo>? = null
  private var facilityCode: String = ""

  @PluginMethod
  fun getButtonReadersInRange(call: PluginCall) {
    val codeInvitacion = call.getString("codeInvitacion")
    if (codeInvitacion != ""){
      val url = this.url.replace("CODEINVITACION", codeInvitacion.toString())
      val client = OkHttpClient()
      val request = Request.Builder()
        .url(url)
        .addHeader(name = this.key, value = this.baseValue)
        .build()

      val completableFuture = CompletableFuture<String>()

      client.newCall(request).enqueue(object : Callback {
        override fun onResponse(call: Call, response: Response) {
          response.use {
            if (!it.isSuccessful) {
              completableFuture.completeExceptionally(IOException("Unexpected code ${it.code}"))
              return
            }
            val body = it.body?.string()
            if (body != null) {
              val json = JSONObject(body)
              val token = json.getString("Code")
              completableFuture.complete(token)
            } else {
              completableFuture.completeExceptionally(IOException("Response body is null"))
            }
          }
        }

        override fun onFailure(call: Call, e: IOException) {
          completableFuture.completeExceptionally(e)
        }
      })

      try {
        val token = completableFuture.get()
        this.mobileAccessContext.bind(token)

        accessAttemptFuture = CompletableFuture<String>()
        currentCall = call


        accessAttemptFuture?.thenAccept{
          if (it == "0") {
            val result = JSObject()
            val array = JSONArray()
            for (credentials in this.mobileAccessContext.getCredentials()) {
              this.readerButton = credentials.getButtonReaders()
              this.facilityCode = credentials.facilityId
              for (button in credentials.getButtonReaders()){
                val jsonObject = JSObject()
                jsonObject.put("id", button.id)
                jsonObject.put("name", button.name)
                array.put(jsonObject)
              }
            }
            result.put("buttonReaderIds", array)
            println(result)
            call.resolve(result)
          } else {
            call.reject("Error con el token")
          }

        }?.exceptionally { e ->
          call.reject("Error during access attempt: ${e.message}")
          null
        }

      } catch (e: Exception) {
        println("Error al obtener el token: ${e.message}")
        call.reject("Error al obtener el token: ${e.message}")
      }
    } else {
      call.reject("Error con el codigo de invitacion")
    }

  }


  fun getTokenAccess() {
    // do something
  }

  @PluginMethod
  fun open(call: PluginCall) {
    val id = call.getString("id")
    val button = this.readerButton?.find { it.id == id }

    // Crear el CompletableFuture para la solicitud actual
    accessAttemptFuture = CompletableFuture<String>()
    currentCall = call

    Handler(Looper.getMainLooper()).post {
      // Esta parte se ejecutará en el hilo principal
      mobileAccessContext.getDevicesInRange(this.facilityCode)
      button?.open()

    }

    // Resolver la llamada del plugin cuando se complete el CompletableFuture
    accessAttemptFuture?.thenAccept { result ->
      val jsResult = JSObject()
      jsResult.put("result", result)
      call.resolve(jsResult)
    }?.exceptionally { e ->
      call.reject("Error during access attempt: ${e.message}")
      null
    }
  }
}
