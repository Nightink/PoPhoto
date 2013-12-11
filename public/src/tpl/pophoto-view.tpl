<div class="modal-header">
    <h3>Pophoto~</h3>
</div>
<div class="form-horizontal">
    <div class="modal-body">
        <div class="control-group form-group">
            <label class="control-label" for="id_image">Pophoto</label>
            <div class="controls uploadDiv">
            </div>
        </div>
        <div class="control-group form-group">
            <label class="control-label" for="id_image"></label>
            <div class="controls sendContain"></div>
        </div>
        <div class="control-group form-group">
            <label class="control-label" for="description">描述</label>
            <div class="controls">
                <textarea id="description" rows="10" cols="40" name="description" placeholder="描述一下吧"></textarea>
                <span id="description-tips"></span>
            </div>
        </div>
        <div class="control-group form-group">
            <label class="control-label">标签</label>
            <div class="controls">
                <input type="text" name="keywords" id="keywords" placeholder="描述下，用于分类">
                <span id="keywords-tips"></span>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" id="photo-submit" data-loading-text="保存中" data-complete-text="确定">确定</button>
        <a href="#new-pin" data-toggle="modal" class="btn">取消</a>
    </div>
</div>