# ethmarket_interview
Interview problems

### 技术选型及理由

选择了angularjs和material design lite作为主题

angular相对熟悉，一直想试试material design

### 开发思路

把原来的index.html改成了test.html

js app.js为主要入口，主要做了几步：

1. 获取最近100条叫单
2. 拆分卖单买单，排除非法单子（交易量为0）
3. 撮合订单，记录已经成交的交易量，和成交的最新的单子
4. 以最新一笔成交的单子获取后面的叫单

ui的部分限制了20条叫单和30条交易单子

交易单展开的部分改成了用dialog的形式展现

问题：如果随机的单子100条如果交易全部无法撮合，有可能无法获取后面叫单的来进行的新的交易