<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{username}}个人信息</title>
</head>
<body>
  {{> top}}

  <div class="row-fluid">
    <div class="container">
      <div class="span3 nav-con">
        <ul id="nav-con-list" class="nav nav-list bs-docs-side affix">
          <li class="active">
            <a href="#photos"><i class="icon-chevron-right"></i>图片管理</a>
          </li>
          <li>
            <a href="#user"><i class="icon-chevron-right"></i>个人信息</a>
          </li>
        </ul>
      </div>

      <div class="span9" id="photo-list">
        <!--{{> photoList}}-->
        <div class="total-items" attr-total="0"></div>
      </div>
    </div>
  </div>

  <script src="/sea-modules/sea-debug.js"></script>
  <script src="/sea-modules/sea-config.js"></script>
  <script src="/src/main/user-main.js"></script>
</body>
</html>
