---
layout: post
title:  "Windows 10 UWP Page Navigation"
date: 2015-10-26 20:17:00
categories: blog
---

Summarized Page Navigation Behavior Logic, through testing in Windows 10 UWP App Project.  

<!--more-->

<br> 

### Navigation Test Cases
---

**Page1 Navigate to Page2**

Current Page is Page1.  
Call Frame.Navigate(typeof(Page2)), the below events will happen:

>   1. Page1.OnNavigatingFrom  
>   2. Page1.OnNavigatedFrom  
>   3. Page2.OnNavigatedTo

  SourcePageType will always be Destination Page (Page2)  
  NavigationMode will always be New  

<br/>

**Page2 GoBack to Page1**

Current Page is Page2.  
Call Frame.GoBack(), the below events will happen.

>    1. Page2.OnNavigatingFrom  
>    2. Page2.OnNavigatedFrom  
>    3. Page1.OnNavigatedTo

SourcePageType will always be Destination Page (Page1)  
NavigationMode will always be Back

<br/>
**Page1 GoForward to Page2**

Current Page is Page2.  
Call Frame.GoBack(), the below events will happen.

>    1. Page1.OnNavigatingFrom  
>    2. Page1.OnNavigatedFrom  
>    3. Page2.OnNavigatedTo

SourcePageType will always be Destination Page (Page2)  
NavigationMode will always be Forward

<br/>  

### Conclusion  
---

When Navigating between StartPage and Destination Page, Navigation Callback sequences will be:

>    1. StartPage.OnNavigatingFrom
>    2. StartPage.OnNavigatedFrom
>    3. DestinationPage.OnNavigatedTo

After StartPage.OnNavigatingFrom return, Before StartPage.OnNavigatedTo is called, things will happen:

>    1. New Instance of DestinationPage is created, **if DestinationPage has not been cached**(See Page.Destination.NavigationCacheMode); Otherwise, cached Instance will be reused.   
>    2. Change Frame.Content from StartPage to DestinationPage;  
>    3. StartPage.Parent will be set to null

After Page2.OnNavigatedTo return

>    Destination.Parent will be set to Frame

If In OnNavigatingFrom， set NavigatingCancelEventArgs.Cancel = true, 
    
>    Navigation flow will be canceled.
