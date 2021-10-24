# 脚本运行插件

可将监视目录下的所有脚本文件自动加入关键字列表，或用“Run”关键字执行。

目前支持的操作系统：

- Windows、Mac

默认支持的脚本类型：

| 文件类型              | 正则表达式 | 命令行 |
|----------------------|----------|-------|
| Python               | `\.py$`  | `python $FILE` |
| Node.js              | `\.js$`  | `node $FILE`   |
| Batch File (Windows) | `\.bat$` | 直接运行        |
| Bash (MacOS)         | `\.sh$`  | `bash $FILE`   |

## 使用方法

1. 用关键字“脚本运行插件设置：添加监视目录”、“Add Folder for ScriptRunner”添加监视目录；
2. 直接输入脚本文件名运行脚本（需要有相应环境支持，即在系统中可以直接运行该文件）；
3. 用关键字“Run”、“运行脚本”，可在脚本文件中搜索；
4. 监视目录内容改变后，可用关键字“重新扫描所有监视目录”刷新脚本文件列表。

注：

- “Run”关键字的搜索规则为：文件名包含所有*搜索关键词*，其中*搜索关键词*为“Run”关键字子输入框内、以空格分隔的所有词语；文件名匹配优先级最高，其次为全路径匹配。
- 脚本运行环境：详见下文：[文件类型设置](#文件类型设置)。

## 设置

用关键字“脚本运行环境设置”、“ScriptRunner Setup”可打开设置选项。

### 插件设置

- 创建关键字：是否为每个脚本创建uTools全局关键字。如果是则可在uTools主界面运行脚本，否则可通过“运行脚本”、“Run”关键字来运行。
- 扫描子文件夹：扫描脚本时是否扫描指定文件夹的子文件夹。
- 环境变量：运行脚本时需要添加的环境变量。

### 文件类型设置

- 名称：文件类型在设置菜单中的显示名称，需唯一。
- 正则表达式：在搜索脚本时使用该正则表达式进行匹配。如“`\.py$`”可匹配所有以“`.py`”结尾的文件，即Python脚本。
- 后缀名：文件类型后缀名，用于获取图标。
- 命令行：执行脚本的命令行，可以为：
  - 空：执行时将直接打开该文件，类似于在文件资源管理器中双击该文件；
  - 一段命令，如“`python`”：执行时将脚本文件完整路径名跟随其后，即执行“`python xxx.py`”；
  - 含“`$FILE`”的一段命令，如“`python $FILE --args`”：执行时将所有“`$FILE`”替换为脚本文件完整路径名，即执行“`python xxx.py --args`”。
- 删除文件类型：删除该文件类型条目（**无法恢复，请谨慎操作**）。

注：

- 点击左侧导航栏“添加新的文件类型”可添加新的文件类型，默认名称为“New File Type”；
- 点击左侧导航栏“重置所有文件类型”将删除所有已配置的文件类型，并重置列表为默认值（**无法恢复，请谨慎操作**）；
- 脚本命令行需要能够在操作系统中直接运行，例如Mac下需要相应程序已在环境变量`/usr/bin`, `/usr/local/bin`等或自定义环境变量中；
- 如果没有默认命令：
  - 对于Windows系统，直接运行文件。如果在操作系统内能直接运行该文件，则本插件能够正常运行该脚本，否则通常会用文本编辑器打开；
  - 对于Mac、Linux系统，需要环境变量已配置为能够直接运行该命令，例如`.sh`文件在文件首行配置了执行程序`#!/bin/sh`等；或者文件为可执行文件。

## Change Log

- 1.0.1：
  - 新增：扫描子文件夹选项。
- 1.0.0
  - 新增：设置界面（鸣谢`utools-recent-projects`作者`LanyuanXiaoyao`）
  - 新增：插件配置、文件类型配置
- 0.0.7
  - 更新：现在监视目录数据存储在本地数据库。
- 0.0.6
  - 修复：Mac下遇目录权限问题导致插件无法运行
- 0.0.5
  - 修复：脚本如需用户输入，则会卡死；现在脚本会独立运行。
- 0.0.4
  - 增加对Node.js、Windows批处理文件和shell脚本的支持。
- 0.0.3
  - 增加Mac支持。
- 0.0.2
  - 添加“Run”、“运行脚本”关键字，支持以空格分隔的若干个词进行模糊匹配。
- 0.0.1
  - 基本功能：“添加监视目录”、“删除监视目录”、“重新扫描所有监视目录”。

## TODO

- [ ] 更复杂的搜索规则，如各单词首字母等，注重搜索的高效与精准
- [ ] 建立更高效的索引
- [ ] 自动扫描及增量扫描机制
- [ ] 界面改进：高亮搜索关键词，类似uTools主搜索栏
- [ ] 更高级的运行环境支持

## 参考项目

- [uTools-QuickerCommand](https://github.com/fofolee/uTools-QuickerCommand)
- [uTools-Plugin-FilePosition](https://github.com/feinir/uTools-Plugin-FilePosition)
- [utools-recent-projects](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects)
