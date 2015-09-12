---
layout: post
title:  "User Agent Stylesheet"
date: 2015-09-12 17:19:48
categories: blog
---

### 让`<p>` 的 "user agent stylesheet" css
在用 Google Chrome "Inspect Element" 查看 html 的时候，发现html的tag, 如 `<p>`，带有一个名为 'user agent stylesheet'的 css, 显示如下。


{% highlight css %}
p {  
	display: block;  
	-webkit-margin-before: 1em;  
	-webkit-margin-after: 1em;  
	-webkit-margin-start: 0px;  
	-webkit-margin-end: 0px;  
}
{% endhighlight %}

正是浏览器对`<p>`设置的默认css定义了`<p>`的显示特性（"block", 段落前后的距离）

<hr />

### 让`<span>` 显示效果和 `<p>`一样

`<span>`是 css display property 默认值为 inline 的元素。显示效果和 `<p>` 不一样。但是如果设置如下的css给`<span>`, `<span class=".paragraph_style_for_span">`, 这个`<span>` 显示效果会和`<p>`完全一样。

{% highlight css %}
.paragraph_style_for_span {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
}
{% endhighlight %}

如果不考虑某些 html element (如image, a)特有的 attribute设置, 不同种类的element在browser中显示的默认效果差别都是由默认的 User Agent Stylesheet 的差异造成的。
