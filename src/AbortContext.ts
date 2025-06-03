export type AbortHandler = () => void;

export class AbortContext {
  private controller: AbortController = new AbortController();
  private aborted: boolean = false;
  private handlers: Set<AbortHandler> = new Set();

  constructor() {}

  public get signal(): AbortSignal {
    return this.controller.signal;
  }

  public abort(): void {
    if (!this.aborted) {
      this.aborted = true;
      this.controller.abort();
      this.handlers.forEach((handler) => {
        try {
          handler();
        } catch (_) {
          /* 무시 */
        }
      });
      this.handlers.clear();
    }
  }

  public registerTask<T>(
    taskFn: (signal: AbortSignal) => Promise<T>,
    onAbortHandler?: AbortHandler
  ): Promise<T> {
    if (onAbortHandler) {
      // 현재 이미 aborted 상태라면 즉시 호출, 아니면 집합에 등록
      if (this.aborted) {
        onAbortHandler();
      } else {
        this.handlers.add(onAbortHandler);
      }
    }
    // taskFn에는 항상 현재 시그널을 전달
    return taskFn(this.signal).catch((err) => {
      if (this.aborted) {
        // 취소된 경우
        throw new Error("Task aborted");
      }
      throw err;
    });
  }

  public offAbort(handler: AbortHandler): void {
    this.handlers.delete(handler);
  }

  public reset(): void {
    this.controller = new AbortController();
    this.aborted = false;
    this.handlers.clear();
  }
}
