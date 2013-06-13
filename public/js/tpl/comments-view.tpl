<div id="remarkLayout">
    <label class="author inline">{{author}}</label><span>发布于：</span><span class="addTime">{{created}}</span>
    <hr/>
    <div class="box_beforeRemark">我也说一句...</div>
    <div class="new_remark">
        <textarea rows="3"></textarea>
        <div class="new_remarkOp">
            <button class="btn btn-success submit">确认发布</button>
        </div>
    </div>
    <hr/>
    <label class="numOfRemark">共有<span class="number">{{number}}</span>条评论</label> <button class="btn refreshComments" >刷新评论</button>
    <ul class="remarkList">
        {{#reviews}}
        <li class="remark">
            <a class="remarker">{{author}}</a><span>{{content}}</span>
            <div class="remark_op">
                <span class ="remarkTime">{{created}}</span>
            </div>
            <hr/>
        <li>
        {{/reviews}}
    </ul>
</div>