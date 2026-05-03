 /**
 * Voice recognition utility using Web Speech API
 */
export class VoiceHandler {
  private recognition: any;
  private isIntentToListen: boolean = false;
  private isActuallyStarted: boolean = false;

  constructor(lang: string = 'zh-CN') {
    this.init(lang);
  }

  private init(lang: string) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      if (this.recognition) {
        try { this.recognition.abort(); } catch(e) {}
      }
      
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false; 
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 20; // 增加备选结果数量
      this.recognition.lang = lang;

      this.recognition.onstart = () => {
        this.isActuallyStarted = true;
        console.log('Voice engine started.');
      };

      this.recognition.onend = () => {
        this.isActuallyStarted = false;
        // 自动重启逻辑，维持“持续监听”体验
        if (this.isIntentToListen) {
          setTimeout(() => this.ensureStarted(), 50);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'no-speech' || event.error === 'aborted') return;
        console.warn('Speech recognition error:', event.error);
        
        // 特别针对 Edge: 如果是网络错误或是权限错误，给出提示
        if (event.error === 'network') {
          console.error('Edge Browser may have network issues with Speech API. Try refreshing or using Chrome/Safari.');
        }

        this.isActuallyStarted = false;
        if (this.isIntentToListen) {
          // 遇到错误时稍作延迟再初始化，避免死循环
          setTimeout(() => this.init(this.recognition.lang), 500);
        }
      };
    } else {
      console.error('Speech Recognition API not supported in this browser.');
    }
  }

  // 暴露一个方法检查是否支持
  public static isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  private ensureStarted() {
    if (!this.recognition || this.isActuallyStarted || !this.isIntentToListen) return;
    try {
      this.recognition.start();
    } catch (e: any) {
      // 捕获可能的已经启动异常
    }
  }

  listen(onResult: (text: string) => void, onSpeechStart?: () => void) {
    if (!this.recognition) return;
    this.isIntentToListen = true;

    this.recognition.onspeechstart = () => {
      if (onSpeechStart) onSpeechStart();
    };

    this.recognition.onresult = (event: any) => {
      if (onSpeechStart) onSpeechStart();

      let words: string[] = [];
      
      // Collect all transcripts from all results in the event
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        for (let j = 0; j < result.length; j++) {
          words.push(result[j].transcript.trim());
        }
      }
      
      const combined = words.join(' ').toLowerCase();
      if (combined) {
        console.log('Recognized:', combined);
        onResult(combined);
      }
    };

    this.ensureStarted();
  }

  stop() {
    this.isIntentToListen = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      this.isActuallyStarted = false;
    }
  }
}