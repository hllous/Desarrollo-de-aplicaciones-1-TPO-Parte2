package com.gestordestock

import android.os.Build
import android.os.StatFs
import android.os.Environment
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableNativeMap

class DeviceInfoModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DispositivoInfo"

    @ReactMethod
    fun getInfo(promise: Promise) {
        val map = WritableNativeMap()
        map.putString("modelo", Build.MODEL)
        map.putString("fabricante", Build.MANUFACTURER)
        map.putString("androidVersion", Build.VERSION.RELEASE)
        map.putInt("sdkVersion", Build.VERSION.SDK_INT)

        val stat = StatFs(Environment.getDataDirectory().path)
        val bytesDisponibles = stat.availableBlocksLong * stat.blockSizeLong
        val mbDisponibles = bytesDisponibles / (1024 * 1024)
        map.putDouble("memoriaDisponibleMB", mbDisponibles.toDouble())

        promise.resolve(map)
    }
}
