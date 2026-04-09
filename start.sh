#!/bin/bash

echo "=== ShadowMap: Arrancando Frontend y Backend ==="

# Arrancar backend en segundo plano
echo "→ Iniciando backend en puerto 3001..."
python3 run.py &
BACKEND_PID=$!

# Esperar a que el backend levante
sleep 2

# Arrancar frontend
echo "→ Iniciando frontend en puerto 3000..."
npm run dev

# Si el frontend se cierra, matar backend
echo "→ Deteniendo backend..."
kill $BACKEND_PID
