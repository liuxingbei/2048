"use strict";
var game={
    data:null,//保存游戏的二维数组
    RN:4,//总行数
    CN:4,//总列数
    state:1,
    RUNNING:1,
    GAMEOVER:0,
    score:0,
    start(){//游戏启动
    	this.data=[];
        this.state=this.RUNNING;
        this.score=0;
    	for(let r=0;r<this.RN;r++){
    		this.data.push([]);
    		for(let c=0;c<this.CN;c++){
    			this.data[r][c]=0;
    		}
    	}
    	this.randomNum();
    	this.randomNum();
    	this.updateView();
    	document.onkeydown=function(e){
             if(this.state==this.RUNNING)
    		switch(e.keyCode){
    			case 37: this.moveLeft();break;
    			case 38: this.moveUp();break;
    			case 39: this.moveRight();break;
    			case 40: this.moveDown();break;
    		}

    	}.bind(this);

    },
    randomNum(){//在一个随机位置上生成2或4
    	while(true){
    		let r=Math.floor(Math.random()*(this.RN));
    		let c=Math.floor(Math.random()*(this.CN));
    		if(this.data[r][c]==0){
    			this.data[r][c]=Math.random()<0.5?2:4;
    			break;
    		}

    	}
    },
    updateView(){
    	for(let r=0;r<this.RN;r++){
    		for(let c=0;c<this.CN;c++){
    			let div=document.getElementById('c'+r+c);
    			if(this.data[r][c]!=0){
    				div.innerHTML=this.data[r][c];
    				div.className="cell n"+this.data[r][c];
    			}else{
    				div.innerHTML="";
    				div.className="cell"
    			}
    		}
    	}
        document.getElementById("score").innerHTML=this.score;
        document.getElementById("gameOver").style.display= this.state==this.GAMEOVER?"block":"none";
    //如果游戏结束，将score写入final
    this.state==this.GAMEOVER&&(
      document.getElementById("final").innerHTML=this.score
    );
    },
    move(callback){
        let before=String(this.data);
        callback.call(this);
        let after=String(this.data);
        if(before!=after){
            this.randomNum();
            if(this.isGameOver()){
                this.state=this.GAMEOVER;
            }
            this.updateView();
        }

    },
    isGameOver:function(){
        for(let r=0;r<this.RN;r++){
            for(let c=0;c<this.CN;c++){
                if(this.data[r][c]==0){
                    return false;
                }else if(c<this.CN-1 && this.data[r][c]==this.data[r][c+1]){
                    return false;
                }else if(r<this.RN-1 && this.data[r][c]==this.data[r+1][c]){
                    return false;
                }
            }
        }
        return true;
    },
    getNextInRow(r,c){
    	for(let i=c+1;i<this.CN;i++){
    		if(this.data[r][i]!=0){
    			return i;
    		}
    	}
    	return -1;

    },
    moveLeftInRow(r){
    	for(let c=0;c<this.CN-1;c++){
    		var nextc=this.getNextInRow(r,c);
    		if(nextc!=-1){
    			if(this.data[r][c]==0){
    				this.data[r][c]=this.data[r][nextc];
    				this.data[r][nextc]=0;
    				c--;
    			}else if(this.data[r][c]==this.data[r][nextc]){
    				this.data[r][c]*=2;
                    this.score+=this.data[r][c];
    				this.data[r][nextc]=0;
    			}
    		}else{
    			break;
    		}
    	}


    },
    
    moveLeft(){
        this.move(function(){
            for(let r=0;r<this.RN;r++){
            this.moveLeftInRow(r);
           }
        })
    	
    },
    moveRight(){
        this.move(function(){
            for(let r=0;r<this.RN;r++){
            this.moveRightInRow(r);
        }
        })
        
    },
    getBeforeInRow(r,c){
        for(let i=c-1;i>=0;i--){
            if(this.data[r][i]!=0){
                return i;
            }
        }
        return -1;

    },
    moveRightInRow(r){
        for(let c=this.CN-1;c>0;c--){
            var prevc=this.getBeforeInRow(r,c);   
            if(prevc!=-1){
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[r][prevc];
                    this.data[r][prevc]=0;
                    c++;
                }else if(this.data[r][c]==this.data[r][prevc]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[r][prevc]=0;
                }
            }else{
                break;
            }
        }


    },
    moveDown(){
        this.move(function(){
            for(let c=0;c<this.CN;c++){
            this.moveDownInColumn(c);
        }
        })
        
    },
    getBeforeInColumn(r,c){
        for(let i=r-1;i>=0;i--){
            if(this.data[i][c]!=0){
                return i;
            }
        }
        return -1;

    },
    moveDownInColumn(c){
        for(let r=this.RN-1;r>=0;r--){
            var prevr=this.getBeforeInColumn(r,c);         
            if(prevr!=-1){
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[prevr][c];
                    this.data[prevr][c]=0;
                    r++;
                }else if(this.data[r][c]==this.data[prevr][c]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[prevr][c]=0;
                }
            }else{
                break;
            }
        }

    },
    getNextInColumn(r,c){
        for(let i=r+1;i<this.RN;i++){
            if(this.data[i][c]!=0){
                return i;
            }
        }
        return -1;

    },
    moveUpInColumn(c){
        for(let r=0;r<this.RN-1;r++){
            var nextr=this.getNextInColumn(r,c);
            if(nextr!=-1){
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[nextr][c];
                    this.data[nextr][c]=0;
                    r--;
                }else if(this.data[r][c]==this.data[nextr][c]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[nextr][c]=0;
                }
            }else{
                break;
            }
        }


    },
    
    moveUp(){
        this.move(function(){
            for(let c=0;c<this.CN;c++){
            this.moveUpInColumn(c);
        }
        })       
    },

}
game.start();
document.getElementById('start').addEventListener("onclick",game.start());