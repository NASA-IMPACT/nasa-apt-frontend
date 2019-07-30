export default function transformInputType(type) {
  switch (type) {
    case 'integer':
      return 'number';
    case 'string':
      return 'text';
    default:
      return 'text';
  }
}
