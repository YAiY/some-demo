// 棋子移动
class piecesMove extends Chess {
  constructor(obj) {
    super(obj)
    this.addEvent()
  }
  // 计算并绘制棋子可以落的点
  droppoint(item) {
    if (!item) return
    let arr = []
    // + 25 焦点从棋子右上角回到棋子中心
    let x = item.x + 25
    let y = item.y + 25
    let type = item.key.split('-')[0] // 棋子阵营
    switch (item.text) {
      case '帅':
        this.click_shuai(x, y, type)
        break;
      case '仕':
        break;
      case '相':
        break;
      case '马':
        break;
      case '车':
        break;
      case '車':
        break;
      case '炮':
        break;
      case '兵':
        this.click_bing(x, y)
        break;
      case '将':
        break;
      case '士':
        break;
      case '象':
        break;
      case '卒':
        break;
      default:
        break;
    }
  }
  // 点击帅
  click_shuai(x, y, type) {
    // 可落点：田字格、空白点、黑棋点
    let centerW = this.ctxW/2
    let centerH = this.ctxH + 50
    for (let i = 0; i < this.allChess.length; i++) {
      // if (this.allChess[i].key === item.key) continue
      if (this.allChess[i].key.includes(type)) continue
        // console.log(this.allChess[i])
      // if (condition) {
      // }
    }
  }
  // 点击兵
  click_bing(x, y) {
    this.protractPoint([
      // 向前一步
      {x, y: y + 50},
      // 向坐一步
      // {x: x + 50, y},
      // // 向右一步
      // {x: x - 50, y},
    ])
  }
}