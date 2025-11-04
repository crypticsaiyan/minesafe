#!/bin/bash
# Clear GPU memory by killing Python processes using GPU
echo "Checking GPU processes..."
nvidia-smi

echo ""
echo "Killing Python processes using GPU..."
pkill -9 python

echo ""
echo "GPU memory cleared. Waiting 2 seconds..."
sleep 2

echo ""
echo "Current GPU status:"
nvidia-smi

echo ""
echo "You can now run: python app.py"
