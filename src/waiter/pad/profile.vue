<style lang='scss'>
	$hei: 65px;
	.mineCom {
		.content-list {
			.mint-cell-value {
				span {
					font-size: 13px;
				}
			}
		}
		.content {
			.content-tabs {
				// align-items: center;
				// min-height: $hei;
				display: flex;
				background-color: white;
				div {
					padding: 12px 0px;
					text-align: center; // display: flex;
					// align-items: center;
					// height: $hei;
					text-align: center;
					border-right: 1px solid rgb(229, 229, 229);
					flex: 1;
					h3 {
						font-size: 20px;
						color: rgb(244, 180, 21);
					}
					&:last-child {
						border-right: none;
					}
				}
			}
			.header {
				min-height: 80px;
				width: 100%;
				display: flex;
				align-items: center;
				.left {
					flex: 1;
					text-align: right;
					img {
						width: 50px;
						height: 50px;
						margin-left: 20px;
						border-radius: 50%;
					}
				}
				.title {
					flex: 1;
					color: white;
				}
				.right {
					flex: 0.5;
					text-align: right;
					img {
						width: 16px;
						margin-right: 20px;
					}
				}
			}
		}
	}
</style>


<template>
  <div class="mineCom">
  		<mt-header style="-webkit-transform: translateZ(0)" slot="header" class="primary_bg" title="我的" :fixed="true">
        <mt-button slot="left" @click="goBack">
     				<img src="@assets/mobile/img/icon/left-w.png" style="width:17px" alt="">
        </mt-button>
  			<mt-button slot="right">
  			</mt-button>
  		</mt-header>

  		<!-- 个人中心内容区域 -->
  		<div slot="content">
  			<section class="content has-header">
  				<section class="header primary_bg">
  					<div class="left">
  						<img src="" alt="">
  					</div>
  					<section class="title" @click="go('/baseHome/login')">
  						<h3 class="fn-16">刘德华</h3>
  						<span class="fn-13">13771162599</span>
  					</section>

  				</section>
  				<div class="content-tabs">
  					<div>
  						<h3>0.00
  							<span class="fn-10">元</span>
  						</h3>
  						<span>订单金额</span>
  					</div>
  					<div>
  						<h3>1
  							<span class="fn-10">个</span>
  						</h3>
  						<span>订单数量</span>
  					</div>
  					<div>
  						<h3>303
  							<span class="fn-10">分</span>
  						</h3>
  						<span>充值金额</span>
  					</div>
  				</div>
  				<br/>
  				<section class="content-list">
  					<mt-cell is-link :title="item.title" v-for="item in list" :key="item.title">
  						<span>{{item.text}}</span>
  						<img slot="icon" :src="item.img" width="20" height="20">
  					</mt-cell>
  				</section>
  			</section>
  			<br/>


  			<section class="content-list">

						<mt-button type="danger" @click="signout">退出</mt-button>

  			</section>
  			<br/>

  		</div>
  	</div>
</template>

<script type="text/babel">
  import {signout} from '@/api/getData'

	export default {
		name: "MineCom",
		data() {
			return {
				list: [{
						title: "店铺地址",
						text: "",
						img: "@assets/mobile/img/mine/address.png"
					},
					{
						title: "我的收藏",
						text: "",
						img: "@assets/mobile/img/mine/heat.png"
					}
				],


			};
		},
		methods: {
			hide() {
				this.$store.commit("SHOW_FOOTER", !this.$store.state.common.hasFooter);
			},
			goBack(){
				console.log(" goback clicked ...")
				this.$router.go(-1)
			},
			async signout(){
				const res = await signout()
				if (res.id == null) {
					this.$message({
						type: 'success',
						message: '退出成功'
					})
					this.$store.commit("resetUser")
				} else {
					this.$message({
						type: 'error',
						message: res.message
					})
				}
			}
		}
	};
</script>
