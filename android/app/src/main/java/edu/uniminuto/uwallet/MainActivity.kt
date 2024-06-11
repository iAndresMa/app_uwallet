
package edu.uniminuto.uwallet

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.lifecycle.LiveData
import androidx.lifecycle.Observer
import com.dorlet.mobileaccess.sdk.BuildConfig
import com.dorlet.mobileaccess.sdk.MobileAccessContext
import com.dorlet.mobileaccess.sdk.domain.AccessAttemptResultInfo
import com.dorlet.mobileaccess.sdk.domain.BindResultInfo
import com.dorlet.mobileaccess.sdk.domain.CredentialInfo
import com.dorlet.mobileaccess.sdk.interfaces.DmaEventListener
import com.example.sdkdma.SDKDMAPlugin
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity(){
  public override fun onCreate(savedInstanceState: Bundle?) {
    registerPlugin(SDKDMAPlugin::class.java)
    registerPlugin(StatusMonitorPlugin::class.java)
    super.onCreate(savedInstanceState)
  }
}
