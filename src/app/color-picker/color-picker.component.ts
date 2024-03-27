import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {
  pixelColors: string[][] = [];
  currentRow: number = 0;
  currentCol: number = 0;
  currentColor: string = ''; // Current color to display
  colorIndex: number = 0; // Index to track current color

  ngOnInit(): void {
    this.extractAllPixelColors();
    this.startPixelColorIteration();
  }

  extractAllPixelColors(): void {
    const imageData = '../../assets/root_temp.jpg';
    const img = new Image();
    img.src = imageData;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        for (let row = 0; row < canvas.height; row++) {
          const rowColors: string[] = [];
          for (let col = 0; col < canvas.width; col++) {
            const pixelData = ctx.getImageData(col, row, 1, 1).data;
            const hexColor = this.rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
            rowColors.push(hexColor);
          }
          this.pixelColors.push(rowColors);
        }
        this.startPixelColorIteration();
      } else {
        console.error('Failed to obtain 2D rendering context.');
      }
    };
  }

  startPixelColorIteration(): void {
    setInterval(() => {
      const rowLength = this.pixelColors.length;
      if (rowLength > 0) {
        const colLength = this.pixelColors[0].length;
        if (colLength > 0) {
          const color = this.pixelColors[this.currentRow][this.currentCol];
          this.currentColor = color; // Set current color
          this.incrementCurrentPosition();
        }
      }
    }, 5000);
  }

  incrementCurrentPosition(): void {
    this.currentCol++;
    if (this.currentCol >= this.pixelColors[0].length) {
      this.currentCol = 0;
      this.currentRow++;
      if (this.currentRow >= this.pixelColors.length) {
        this.currentRow = 0;
      }
    }
  }

  rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}