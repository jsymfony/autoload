Autoload
================

Данный модуль осуществляет автоматическую загрузку файлов для реализации аналога пространства имен (namespaces). 

Пример
---------
В проекте Acme имеется файл src/Foo/Bar.js

```javascript
var autoload = require('autoload');
autoload.register('Acme', 'путь_до_директории_src');
//или autoload.register('Acme.Foo', 'путь_до_директории_src/Foo');

// теперь можно использовать пространства имен (никаких лишних require не нужно)
new Acme.Foo.Bar();
```