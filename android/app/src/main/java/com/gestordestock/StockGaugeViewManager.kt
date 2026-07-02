package com.gestordestock

import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class StockGaugeViewManager : SimpleViewManager<StockGaugeView>() {

    override fun getName(): String = "StockGaugeView"

    override fun createViewInstance(context: ThemedReactContext): StockGaugeView =
        StockGaugeView(context)

    @ReactProp(name = "bajo")
    fun setBajo(view: StockGaugeView, value: Int) {
        view.bajo = value
    }

    @ReactProp(name = "medio")
    fun setMedio(view: StockGaugeView, value: Int) {
        view.medio = value
    }

    @ReactProp(name = "alto")
    fun setAlto(view: StockGaugeView, value: Int) {
        view.alto = value
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        MapBuilder.of(
            "topSegmentPress", MapBuilder.of("registrationName", "onSegmentPress")
        )
}
