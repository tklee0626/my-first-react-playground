# Project Guidelines

## Import Rules

- **배럴(Barrel) 파일 사용 금지**: `index.js`를 통한 re-export 패턴을 사용하지 않음
- 컴포넌트는 직접 경로로 import할 것

```js
// Good
import Card from './components/Card/Card';
import ProductCard from './components/ProductCard/ProductCard';

// Bad - 배럴 파일 사용
import { Card, ProductCard } from './components';
```
