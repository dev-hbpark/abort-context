# AbortContext

비동기 작업의 취소를 쉽게 관리할 수 있는 TypeScript 유틸리티 라이브러리입니다.

## 설치

```bash
npm install abort-context
```

## 주요 기능

- `AbortController`와 `AbortSignal`을 활용한 비동기 작업 취소 관리
- 취소 핸들러 등록 및 관리
- 작업 취소 시 자동 정리
- 작업 재사용을 위한 리셋 기능

## 사용 예시

```typescript
import { AbortContext } from "abort-context";

const abortContext = new AbortContext();

// 비동기 작업 등록
const task = abortContext.registerTask(
  async (signal) => {
    // 비동기 작업 수행
    const response = await fetch("https://api.example.com/data", { signal });
    return response.json();
  },
  () => {
    // 취소 시 실행될 정리 작업
    console.log("작업이 취소되었습니다.");
  }
);

// 작업 취소
abortContext.abort();

// 작업 재사용을 위한 리셋
abortContext.reset();
```

## API

### AbortContext

#### 생성자

```typescript
constructor();
```

#### 속성

- `signal: AbortSignal` - 현재 컨트롤러의 시그널

#### 메서드

- `abort(): void` - 등록된 모든 작업을 취소하고 정리 핸들러를 실행합니다.
- `registerTask<T>(taskFn: (signal: AbortSignal) => Promise<T>, onAbortHandler?: AbortHandler): Promise<T>` - 새로운 비동기 작업을 등록합니다.
- `offAbort(handler: AbortHandler): void` - 등록된 취소 핸들러를 제거합니다.
- `reset(): void` - 컨텍스트를 초기 상태로 리셋합니다.

## 라이선스

MIT
