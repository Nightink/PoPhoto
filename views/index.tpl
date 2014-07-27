<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{title}}</title>
</head>
<body>
    {{> top}}

    <div class="photo-main">
        {{> photo-flow}}
        <div id="loader">
            <img src="/assets/images/loader.gif" alt="Loader">
        </div>
    </div>

    <div class="modal hide fade" id="register-user"></div>
    <div class="backToTop" style="z-index: 999">返回顶部</div>

    <script src="/sea-modules/sea-debug.js"></script>
    <script src="/sea-modules/sea-config.js"></script>
    <script src="/src/main/index-main.js"></script>
</body>
</html>
