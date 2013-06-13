                {{#user}}
                <span class="canceled">[<a href="/login-out">注销</a>]</span>
                <span class="loginName"> 欢迎您<span><a href="/user/{{_id}}">{{username}}</a></span>！</span>
                <button class="btn btn-success uploadBtn" data-toggle="modal">PoPhoto</button>
                {{/user}}
                {{^user}}
                <input type="text" name="email" class="input-mini span2 email" placeholder="邮箱" style="margin-left: 20px;">
                <input type="password" name="password" class="input-mini span1 password" placeholder="密码">
                <button class="btn btn-success" id="user-login" data-loading-text="登录中..." data-complete-text="登录" style=" margin-top: -7px;">登录</button>
                <button class="btn btn-warning" id="user-register" style=" margin-top: -7px;">注册</button>
                {{/user}}