// 象棋初始化 构造函数
class Chess {
  constructor({ ctx, ctxW, ctxH, arrRed, arrBlack }) {
    if (!ctx) return
    this.canvas = canvas
    this.ctx = ctx
    this.ctxW = ctxW
    this.ctxH = ctxH
    this.inStart = 25 // 内部棋盘 canvas 起始点
    this.arrRed = arrRed
    this.arrBlack = arrBlack
    this.chessPiecesArr = {
      red: arrRed,
      black: arrBlack
    } // 所有棋子 集合
    this.allChess = this.chessPiecesArr.red.concat(this.chessPiecesArr.black)
    this.currentCheck = null // 当前被点击棋子
    this.init()
    // this.addEvent()
  }
  init() {
    // 横向
		this.drawLine(ctxW + 50, 'X', ctxH + 25)
		// 纵向
    this.drawLine(ctxH + 50, 'Y', ctxW + 25)
    this.shiLine(0 + 25, 100)
		this.shiLine(ctxH + 25, -100)
    this.createChessPieces()
  }
  // 绘制棋盘线路
  drawLine(lineLen, moveTo, moveLen) {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    for (var i = lineLen; i > 0 ; i--) {
      if ((i - 25) % 50 === 0) {
        if (i === lineLen) continue
        if (moveTo === 'X') {
          // 两点直接绘制线路
          ctx.moveTo(i, moveLen) // 开始 坐标轴
          ctx.lineTo(i, 25) // 结束 坐标轴 （横向坐标，纵向坐标）
        } else if(moveTo === 'Y') {
          ctx.moveTo(moveLen, i) // 开始 坐标轴
          ctx.lineTo(25, i) // 结束 坐标轴 （横向坐标，纵向坐标）
        }
        ctx.stroke() // 绘制
      }
    }
		ctx.closePath();
		// ‘楚河汉界’ 矩形
    ctx.beginPath();
    ctx.fillStyle = 'rgb(143,122,102)';
		ctx.fillRect(0 + 25, 200 + 25, ctxW, 50); // 画一个填充矩形
		// ctx.fillRect(x 起始点, y 起始点, 长, 高); // 画一个填充矩形
		ctx.closePath();
  }
  // 绘制 ‘士’ 线路
  shiLine(Y, val) {
    let center = (ctxW + 50)/2; // 获取中心点
    ctx.moveTo(center + 50, Y)
    ctx.lineTo(center - 50, Y + val)
    ctx.stroke() // 绘制
    ctx.moveTo(center - 50, Y)
    ctx.lineTo(center + 50, Y + val)
    ctx.stroke() // 绘制
  }
  // 创建棋子
  createChessPieces() {
    this.chessPiecesArr.red.forEach((item, index) => {
      if (!item.type) {
        item.key = 'red-' + index // 每个棋子的key
        item.type = 'red' // 阵营
        item.x = item.x * 50
        item.y = item.y * 50
      }
      this.renderChessPieces(item)
    })
    this.chessPiecesArr.black.forEach((item, index) => {
      if (!item.type) {
        item.key = 'black-' + index // 每个棋子的key
        item.type = 'black' // 阵营
        item.x = item.x * 50
        item.y = item.y * 50
      }
      this.renderChessPieces(item)
    })
  }
  // 绘制棋子
  renderChessPieces(item) {
    // console.log(item);
    var bgColor, textColor;
    if (!item.type) {
      return
    } else if (item.type === 'red') {
      bgColor = 'red'
      textColor = 'black'
    } else if(item.type === 'black') {
      bgColor = 'black'
      textColor = 'red'
    }
    // 开始绘制路径
    this.ctx.fillStyle = bgColor
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = textColor;
    // 绘制圆的路径**
    this.ctx.arc(this.inStart + item.x, this.inStart + item.y, 21, 0, Math.PI * 2, true); // ctx.arc(圆心 x, 圆心 y, 半径, startAngle, endAngle, Boolean)
    this.ctx.fill()
    // 0°是从三点钟方向开始的
    // 描边路径
    this.ctx.stroke();
    // 设置字体
    this.ctx.font = "18px bold 黑体";
    // 设置颜色
    this.ctx.fillStyle = textColor;
    // 设置水平对齐方式
    this.ctx.textAlign = "center";
    // 设置垂直对齐方式
    this.ctx.textBaseline = "middle";
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    this.ctx.fillText(item.text, item.x + this.inStart, item.y + this.inStart);
  }
  // 点击事件
  addEvent() {
    this.canvas.onclick = (e) => {
      // console.log(e)
      // console.log(this.allChess);
      let x = e.offsetX - 25
      let y = e.offsetY - 25
      let clickItem = null
      // 循环判断 是否点击到棋子
      this.allChess.some(item => {
        if (this.clickScope(x,y, item.x, item.y)) {
          clickItem = item
          return true
        }
      })
      // 存在已选棋子
      if (this.currentCheck) {
        // 是否再次点击到棋子
        if (clickItem) { 
          console.log(this.currentCheck, clickItem);
          // 是否为同一棋子
          if (clickItem.key === this.currentCheck.key) {
            clickItem.isCheck = false
            this.currentCheck = null
          } else if (clickItem.type === this.currentCheck.type){ // 是否为同一阵营棋子
            this.currentCheck.isCheck = false
            clickItem.isCheck = true
            this.currentCheck = clickItem
          } else {
            this.dropPointClick(x, y, clickItem)
          }
        } else {
          // 判断是否点击到棋子落点
          this.dropPointClick(x, y)
        }
        
      } else {
        if (clickItem) {
          clickItem.isCheck = true
        }
      }
      if (clickItem && clickItem.isCheck && !this.currentCheck) {
        this.currentCheck = clickItem
      }
      // 当前被点击棋子
      this.checkStatus(this.currentCheck)
    }
    // this.canvas.addEventListener('click', this.ctxEvent())
  }
  // 点击事件的逻辑
  handleClickLogic() {

  }
  // ctxEvent(e) 
  // 绘制点击后棋子状态
  checkStatus(item) {
    console.log(item);
    this.reset()
    // debugger
    if (item && item.isCheck) {
      let itemX = item.x + this.inStart
      let itemY = item.y + this.inStart
      let scope = 22
      // console.log(item,itemX - scope,itemY - scope);
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#00f";
      this.ctx.lineWidth = 1;
      // 右上
      this.ctx.moveTo(itemX - scope, itemY - scope);
      this.ctx.lineTo(itemX - scope + 10, itemY - scope);
      this.ctx.moveTo(itemX - scope, itemY - scope);
      this.ctx.lineTo(itemX - scope, itemY - scope + 10);
      // 右下
      this.ctx.moveTo(itemX + scope, itemY - scope);
      this.ctx.lineTo(itemX + scope - 10, itemY - scope);
      this.ctx.moveTo(itemX + scope, itemY - scope);
      this.ctx.lineTo(itemX + scope, itemY - scope + 10);
      
      // // 左上
      this.ctx.moveTo(itemX - scope, itemY + scope);
      this.ctx.lineTo(itemX - scope + 10, itemY + scope);
      this.ctx.moveTo(itemX - scope, itemY + scope);
      this.ctx.lineTo(itemX - scope, itemY + scope - 10);
      // 左下
      this.ctx.moveTo(itemX + scope, itemY + scope);
      this.ctx.lineTo(itemX + scope - 10, itemY + scope);
      this.ctx.moveTo(itemX + scope, itemY + scope);
      this.ctx.lineTo(itemX + scope, itemY + scope - 10);

      this.ctx.stroke();
      this.ctx.closePath();
    }
    this.droppoint(item)
  }
  // 判断是否点击到棋子落点
  dropPointClick(x, y, clickItem) {
    console.log(x, y, clickItem);
    // if (this.currentCheck.jumpDrop) {
    //   this.currentCheck.jumpDrop.forEach(item => {

    //   })
    // } else {
      // 点击空白处 - 取消选中状态
      this.currentCheck.isCheck = false
      this.currentCheck = null
    // }
  }
  // 重置画布
  reset() {
    this.ctx.clearRect(0, 0,this.ctxW + 50,this.ctxH + 50);
    this.init()
  }
  
  // 根据坐标画落点
  protractPoint(pointArr) {
    console.log(pointArr)
    pointArr = this.judgmentPoint(pointArr)
    pointArr.forEach(item => {
      this.ctx.beginPath();
      this.ctx.arc(item.x, item.y, 4, 2*Math.PI, false)
      this.ctx.fillStyle = 'pink'
      this.ctx.fill();
    })
  }

  // 判断落点是否合规
  judgmentPoint(pointArr) {
    // pointArr.forEach(item => {

    // })
    this.currentCheck.jumpDrop = pointArr
    return pointArr
  }
  
  // 点击范围判断 是否点击到棋子
  clickScope(clickX, clickY, targetX, targetY) {
    let isOk = false, scope = 20;
    let maxX, maxY, minX, minY;
    maxX = targetX + scope
    minX = targetX - scope
    maxY = targetY + scope
    minY = targetY - scope
    if (clickX > minX && clickX < maxX) {
      if (clickY > minY && clickY < maxY) {
        isOk = true
      }
    }
    return isOk
  }
  // 棋子落点
  piecesMove() {
    
  }
}