
    <div class="modal-header">
        <a class="close" data-dismiss="modal">x</a>
        <h3>图片信息修改</h3>
    </div>

    <div class="modal-body">
        <div>
            <label>图片标题：</label>
            <input type="text" class="input-xlarge" id="title" name="title" value="{{title}}"><span id="title-tips"></span>
        </div>
        <div>
            <label>图片描述：</label>
            <input type="text" class="input-xlarge" id="description" name="description" value="{{description}}"><span id="email-tips"></span>
        </div>
        <div>
            <label>图片关键字：</label>
            <input type="text" class="input-xlarge" id="keywords" name="keywords" value="{{keywords}}"><span id="password-tips"></span>
        </div>
    </div>

    <div class="modal-footer">
        <a class="btn btn-primary sure-update" data-loading-test="修改中..." data-complete-text="确定">确定</a>
        <a class="btn close-cancel">关闭</a>
    </div>