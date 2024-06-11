package edu.uniminuto.uwallet

import android.bluetooth.BluetoothAdapter
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.location.LocationManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "StatusMonitor")
class StatusMonitorPlugin : Plugin() {

  private val bluetoothReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      val action = intent.action
      if (BluetoothAdapter.ACTION_STATE_CHANGED == action) {
        val state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR)
        when (state) {
          BluetoothAdapter.STATE_OFF -> notifyListeners("bluetoothStatusChange", createResult("off"))
          BluetoothAdapter.STATE_ON -> notifyListeners("bluetoothStatusChange", createResult("on"))
        }
      }
    }
  }

  private val locationReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
      val isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
      val isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)

      if (isGpsEnabled || isNetworkEnabled) {
        notifyListeners("locationStatusChange", createResult("on"))
      } else {
        notifyListeners("locationStatusChange", createResult("off"))
      }
    }
  }

  override fun load() {
    super.load()
    if (!hasPermissions()) {
      requestPermissions()
    } else {
      registerReceivers()
    }
  }

  private fun hasPermissions(): Boolean {
    val permissions = arrayOf(
      android.Manifest.permission.ACCESS_FINE_LOCATION,
      android.Manifest.permission.ACCESS_COARSE_LOCATION,
      android.Manifest.permission.BLUETOOTH_SCAN,
      android.Manifest.permission.BLUETOOTH_CONNECT
    )
    return permissions.all { ContextCompat.checkSelfPermission(context, it) == PackageManager.PERMISSION_GRANTED }
  }

  private fun requestPermissions() {
    ActivityCompat.requestPermissions(
      activity,
      arrayOf(
        android.Manifest.permission.ACCESS_COARSE_LOCATION,
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.BLUETOOTH_SCAN,
        android.Manifest.permission.BLUETOOTH_CONNECT
      ),
      PERMISSION_REQUEST_CODE
    )
  }

  override fun handleRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<out String>,
    grantResults: IntArray
  ) {
    super.handleRequestPermissionsResult(requestCode, permissions, grantResults)
    if (requestCode == PERMISSION_REQUEST_CODE) {
      if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
        registerReceivers()
      }
    }
  }

  private fun registerReceivers() {
    context.registerReceiver(bluetoothReceiver, IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED))
    context.registerReceiver(locationReceiver, IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION))
  }

  override fun handleOnDestroy() {
    super.handleOnDestroy()
    context.unregisterReceiver(bluetoothReceiver)
    context.unregisterReceiver(locationReceiver)
  }

  private fun createResult(status: String): JSObject {
    val result = JSObject()
    println("im here status")
    result.put("status", status)
    return result
  }

  companion object {
    private const val PERMISSION_REQUEST_CODE = 1001
  }
}
