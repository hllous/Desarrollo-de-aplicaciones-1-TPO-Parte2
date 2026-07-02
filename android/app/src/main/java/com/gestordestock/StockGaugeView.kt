package com.gestordestock

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.view.MotionEvent
import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

class StockGaugeView(context: Context) : View(context) {

    var bajo: Int = 0
        set(value) { field = value; invalidate() }
    var medio: Int = 0
        set(value) { field = value; invalidate() }
    var alto: Int = 0
        set(value) { field = value; invalidate() }

    // Orden fijo de dibujo, en sentido horario desde las 12: Bajo -> Medio -> Alto.
    private data class Segmento(val nivel: String, val inicio: Float, val sweep: Float)

    private var segmentos: List<Segmento> = emptyList()
    private val rect = RectF()
    private var grosorTrazo = 0f
    private var nivelSeleccionado: String? = null

    private val arcPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeCap = Paint.Cap.ROUND
    }

    private val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        color = Color.parseColor("#e5e7eb")
    }

    init {
        isClickable = true
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        val size = Math.min(width, height).toFloat()
        if (size <= 0f) return

        grosorTrazo = size * 0.14f
        bgPaint.strokeWidth = grosorTrazo

        val padding = grosorTrazo / 2 + 4f
        rect.set(padding, padding, size - padding, size - padding)

        canvas.drawArc(rect, 0f, 360f, false, bgPaint)

        val total = bajo + medio + alto
        if (total <= 0) {
            segmentos = emptyList()
            return
        }

        val definicion = listOf(
            Triple("alto", alto, Color.parseColor("#22c55e")),
            Triple("medio", medio, Color.parseColor("#f59e0b")),
            Triple("bajo", bajo, Color.parseColor("#ef4444"))
        )

        var startAngleDibujo = -90f
        var inicioHitTest = 0f
        val nuevosSegmentos = mutableListOf<Segmento>()

        for ((nivel, cantidad, color) in definicion) {
            if (cantidad <= 0) continue
            val sweep = 360f * cantidad / total

            arcPaint.color = color
            arcPaint.strokeWidth = if (nivel == nivelSeleccionado) grosorTrazo * 1.25f else grosorTrazo
            canvas.drawArc(rect, startAngleDibujo, sweep, false, arcPaint)

            nuevosSegmentos.add(Segmento(nivel, inicioHitTest, sweep))
            startAngleDibujo += sweep
            inicioHitTest += sweep
        }

        segmentos = nuevosSegmentos
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_DOWN) {
            val nivel = encontrarNivelEn(event.x, event.y)
            val nuevaSeleccion = if (nivel != null && nivel == nivelSeleccionado) null else nivel
            actualizarSeleccion(nuevaSeleccion)
            return true
        }
        return super.onTouchEvent(event)
    }

    override fun onHoverEvent(event: MotionEvent): Boolean {
        when (event.action) {
            MotionEvent.ACTION_HOVER_ENTER, MotionEvent.ACTION_HOVER_MOVE -> {
                actualizarSeleccion(encontrarNivelEn(event.x, event.y))
            }
            MotionEvent.ACTION_HOVER_EXIT -> {
                actualizarSeleccion(null)
            }
        }
        return super.onHoverEvent(event)
    }

    private fun actualizarSeleccion(nivel: String?) {
        if (nivel == nivelSeleccionado) return
        nivelSeleccionado = nivel
        invalidate()
        enviarEventoSeleccion(nivel)
    }

    private fun encontrarNivelEn(x: Float, y: Float): String? {
        if (rect.isEmpty) return null

        val dx = x - rect.centerX()
        val dy = y - rect.centerY()
        val distancia = Math.hypot(dx.toDouble(), dy.toDouble()).toFloat()

        val radio = rect.width() / 2
        val mitadBanda = grosorTrazo / 2 + 12f
        if (distancia < radio - mitadBanda || distancia > radio + mitadBanda) return null

        val anguloCrudo = Math.toDegrees(Math.atan2(dy.toDouble(), dx.toDouble())).toFloat()
        val anguloDesdeArriba = ((anguloCrudo + 90f) % 360f + 360f) % 360f

        return segmentos.firstOrNull { segmento ->
            anguloDesdeArriba >= segmento.inicio && anguloDesdeArriba < segmento.inicio + segmento.sweep
        }?.nivel
    }

    private fun enviarEventoSeleccion(nivel: String?) {
        val reactContext = context as? ReactContext ?: return
        val params = Arguments.createMap()
        if (nivel != null) {
            params.putString("nivel", nivel)
        } else {
            params.putNull("nivel")
        }
        reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, "topSegmentPress", params)
    }
}
