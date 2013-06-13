<form class="form-horizontal user-info">
    <fieldset>
        <legend>个人信息</legend>
        <div class="control-group">
            <label class="control-label" for="username">个人昵称 ：</label>

            <div class="controls">
                <input type="text" class="input-xlarge" name="username" value="{{username}}" id="username">
                <span class="help-inline" id="username-help"></span>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="email">邮箱 ：</label>

            <div class="controls">
                <input type="text" readonly class="input-xlarge" name="email" value="{{email}}" id="email">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="gender">性别 ：</label>

            <div class="controls">
                <input type="radio" name="gender" value="男">男
                <input type="radio" name="gender" value="女">女
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="password">密码 ：</label>

            <div class="controls">
                <input type="password" class="input-xlarge" name="password" value="{{password}}" id="password">
                <span class="help-inline" id="password-help"></span>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="password">确认密码 ：</label>

            <div class="controls">
                <input type="password" class="input-xlarge" name="cpassword" value="{{password}}"
                       id="confirm-password">
                <span class="help-inline" id="cpassword-help"></span>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="discipline">专业 ：</label>

            <div class="controls">
                <input type="text" class="input-xlarge" name="discipline" value="{{discipline}}" id="discipline">
                <span class="help-inline" id="discipline-help"></span>
            </div>
        </div>
        <div class="form-actions">
            <button class="btn btn-primary" id='update' type="button">修改</button>
            <button class="btn" type="reset">重置</button>
        </div>
    </fieldset>
</form>