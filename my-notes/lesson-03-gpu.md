# Lesson 3: GPU Setup & Cloud

Laptop: no NVIDIA GPU, 8 CPU cores. Using Google Colab (Tesla T4, 15.6 GB VRAM) for GPU lessons.

4000x4000 matrix multiply:
- Laptop CPU: 902 ms
- T4 GPU fp32: 28.3 ms (~32x faster)
- T4 GPU fp16: 2.8 ms (~320x faster, Tensor Cores)

Lesson script reported only 9x: no warm-up, so CUDA start-up time was included.
T4 max model size (fp16, weights only): ~8B parameters. Training needs ~3-4x more memory.

## Update: MacBook Air M4 (Nov 5)
- M4 CPU: 66.6 ms (~12x faster than old Windows laptop CPU)
- M4 GPU (MPS): 43.7 ms, close to Colab T4 fp32 (28.3 ms)
- Apple's CPU has built-in matrix hardware, so the GPU gain over the CPU is small here (~1.5x)
