---
layout: post
title:  "CMake简要笔记"
date: 2018-05-12
categories: blog
---
### 安装cmake
```sh
brew install cmake
```

### 用cmake进行build

```sh
cd <source_code_root_path>
mkdir buid && cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=../ios.toolchain.cmake -DIOS_PLATFORM=OS -DIOS_DEPLOYMENT_TARGET=10.0
# -DCMAKE_TOOLCHAIN_FILE 用CMAKE_TOOLCHAIN_FILE变量指定Cross-Compile(e.g.在Mac上编译iOS代码)需要使用的toolchain文件。
# -D <var>=<value> 定义可选的cache变量
# .. 用来指定source tree根目录在上一层目录

make VERBOSE=1 
# 进行build。 使用VERBOSE=1输出详细的编译信息。
```

### CMakeLists.txt

当CMake处理项目的source tree时，入口点是项目根目录的CMakeLists.txt。 CMakeLists.txt又可以通过`add_subdictionary`来包含子目录，通过`add_subdictionary`包含进来的子目录必须有它自己的CMakeLists.txt。

CMakeLists.txt是使用CMake Language编写的。

### Target

CMake buildsystem 通过一系列逻辑Target对象组织而成, CMake通过Target的依赖关系决定编译顺序。

CMake有三种Target类型. `executable`, `library`, 和通过客户化command设定的`custom` target。
* `executable`target通过`add_executable`设定， 如`add_executable(mytool mytool.cpp)`。  
* `library`target通过`add_library`设定, 如`(archive SHARED archive.cpp zip.cpp lzma.cpp)`。

### Varibales

CMake Language中的变量有三种Scope, Function Scope, Directory Scope，Persistent Cache。

#### 设置变量值

在Function中，通过`set`设置的变量可以在当前Function或者被它嵌套调用的其他函数中使用。但是在这个函数外部不可见。

Source tree 中的每一个目录(Directory)，在CMakeLists.txt中通过 `set` 方法定义属于它的变量(Directory Scope)。Directory Scope 变量会被拷贝继承到Child  Dictionary中。

`set(CMAKE_C_COMPILER_FORCED TRUE)` 设置变量`CMAKE_C_COMPILER_FORCED`为`TRUE`   
`set(IOS_ARCH armv7 armv7s arm64)`, 设置变量`IOS_ARCH`为`armv7;armv7s;arm64`。这是一个通过`;`结合的LIST变量(`;list`变量)

Cache Scope的变量被持久化存储在Cache文件中，运行cmake命令时可以读取到上次运行cmake命令所设置的变量信息。**SET CACHE 只有在变量不存在，或者额外指定FORCE参数时，才会被设置。**Cache Scope可以通过CMake GUI 客户端程序进行配置。

`set(IOS_DEPLOYMENT_TARGET "8.0" CACHE STRING "Minimum iOS version to build for." )` 将变量`IOS_DEPLOYMENT_TARGET`，设置值`8.0`, Scope为`CACHE`。

`CACHE`后面的类型信息和描述信息是给cmake gui显示UI界面用的，比如为`STRING`类型显示Text Field控件，为`BOOL`类型显示Checkbox控件,为`PATH`类型显示File Dialog。

#### 读取变量值

  通过`${变量名}`读取变量值，如
  `message(STATUS "Using SDK: ${CMAKE_OSX_SYSROOT} for platform: ${IOS_PLATFORM}")`

### 常用变量  

| 变量 | 描述 | 
| ------------- |:-------------|
| CMAKE_CURRENT_BINARY_DIR | 当前正在处理的CMakeLists.txt所对应的Build输出目录|
| CMAKE_BINARY_DIR         | 顶层输出目录|
| CMAKE_CURRENT_SOURCE_DIR |当前正在处理的CMakeLists.txt所对应的源码目录|
| CMAKE_SOURCE_DIR         |源码根目录|
| CMAKE_<LANG>_COMPILER   |指定编译器, e.g. set(CMAKE_CXX_COMPILER "/usr/bin/g++-4.2")|

### 常用的方法

- 检查变量是否已经被定义:  
```cmake
if (NOT DEFINED CMAKE_OSX_SYSROOT)
```

- 检查变量表示的目录或文件是否存在:  
```cmake
if (NOT EXISTS ${CMAKE_OSX_SYSROOT})
```  

- 比较字符串:  
```cmake
if(<variable|string> STREQUAL <variable|string>)
``` 

- 运行程序，将程序的标准输出赋值给变量:  
```cmake
    execute_process(COMMAND xcodebuild -version -sdk ${XCODE_IOS_PLATFORM} Path    
        OUTPUT_VARIABLE CMAKE_OSX_SYSROOT
        ERROR_QUIET
        OUTPUT_STRIP_TRAILING_WHITESPACE
    )
```
