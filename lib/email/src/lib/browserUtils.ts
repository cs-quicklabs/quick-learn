import { exec } from 'child_process';
import { platform } from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export class BrowserUtils {
  static getTempFilePath(): string {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const randomId = crypto.randomBytes(16).toString('hex');
    return path.join(tempDir, `preview-${randomId}.html`);
  }

  private static getOpenCommand(filePath: string): string {
    switch (platform()) {
      case 'linux':
        return `xdg-open "${filePath}"`;
      case 'darwin':
        return `open "${filePath}"`;
      case 'win32':
        return `start "" "${filePath}"`;
      default:
        throw new Error('Unsupported platform');
    }
  }

  static async openInBrowser(filePath: string): Promise<void> {
    const command = this.getOpenCommand(filePath);
    return new Promise((resolve, reject) => {
      exec(command, (error) => {
        if (error) {
          console.error('Error opening browser:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  static async previewHTML(htmlContent: string): Promise<void> {
    const tempFilePath = this.getTempFilePath();
    fs.writeFileSync(tempFilePath, htmlContent);

    console.log('Opening preview in browser...');
    await this.openInBrowser(tempFilePath);

    // Clean up temp file after delay
    setTimeout(() => {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }, 5000);
  }
}
