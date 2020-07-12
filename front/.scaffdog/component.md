---
name: 'component'
description: 'For generate component files'
message: 'Please enter component name.'
root: './src/'
output: '/{components,container,pages}*'
ignore: []
---

# `{{ input | pascal }}/index.ts`

```typescript
export { {{ input | pascal }} } from './{{ input | pascal }}';
```

# `{{ input | pascal }}/{{ input | pascal }}.tsx`

```typescript
import React from 'react'
import './{{ input | camel }}.scss'

export const {{ input | pascal }}:React.FC = () => {
  return (

  )
};
```

# `{{ input | pascal }}/{{ input | camel }}.scss`

```scss
```
