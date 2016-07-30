
PGF tools v0.5 by tpu
---------------------

PGF工具包用于创建与编辑PSP的系统字库，可用于XMB以及游戏中，提供更好的体验。



使用说明
--------

dump_pgf.exe
    用于显示pgf字库的各种信息。

    dump_pgf [-h] [-m] [-c] [-i] [-s] [-p] [-b] {pgf file}

      -h: 字体头信息
      -m: 字体尺寸信息表
      -c: 字体所包含的字符的unicode列表
      -i: 每个字符的信息
      -s: 包含有阴影信息的字符列表
      -p: 字符在文件中的指针表
      -b: 全部字符的位图，每页256个字符

    其中，-c选项生成的列表，可以用于后两个工具。

mix_pgf.exe
    混合两个pgf字体的字符

    mix_pgf <target.pgf> <source.pgf>
    用<source.pgf>中的字符替换<target.pgf>中的相同字符。
    如果存在xxx.pgf.txt列表文件，则程序按照xxx.pgf.txt列表加载xxx.pgf中的字符，而不加载整个pgf字库。

ttf_pgf.exe
    从TTF字库生成PGF字库

    ttf_pgf {xxx.ttf} {out.pgf} [unicode list]
    加载xxx.ttf中的字符，保存为out.pgf。
    如果指定一个unicode列表文件，则不加载整个TTF字库，只加载列表中的字符。


一些例子
--------
    dump_pgf -c jpn0.pgf > list_jpn0.txt
    取得系统字体jpn0.pgf的全部字符列表

    dump_pgf -b jpn0.pgf
    将jpn0.pgf中的全部字，按页转换为bmp图，存放到目录jpn0_bmp中。

    ttf_pgf msyh.ttf new_jpn0.pgf list_jpn0.txt
    用雅黑字体，重新生成jpn0.pgf

    mix_pgf new_jpn0.pgf ltn0.pgf
    用ltn0.pgf中的字符，替换new_jpn0.pgf中的英文字符。


致谢
----

skylark@mips.for.ever
做出了最早的PGF制作工具，虽然只支持英文

BenHur - http://www.psp-programming.com/benhur
对PGF格式做出了详细的描述

