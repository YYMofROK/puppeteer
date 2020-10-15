
// node tmon_001_send_delivery_doc.js "{\"sellerId\":\"YmVzdG1k\",\"sellerPw\":\"YnRzbWQ5NzA3IQ==\",\"ordNo\":\"MjczMTA2MTc5NA==\",\"dlvNo\":\"Njk1OTg1MDA2\",\"prdNo\":\"NDM5NTMzMDQxNA==\",\"companyName\":\"Q0rrjIDtlZzthrXsmrQ=\",\"invoiceNo\":\"NjM0NzQxOTk0NzAz\"}"
const fs		= require("fs");
const puppeteer = require("C:\\Users\\yym\\node_modules\\puppeteer");
const cheerio   = require("C:\\Users\\yym\\node_modules\\cheerio");

//const fs		= require("fs");
//const puppeteer = require("puppeteer");
//const cheerio   = require("cheerio");

let params				=	JSON.parse(process.argv[2]);

const sellerId		= Buffer.from( params.sellerId, "base64").toString('utf8');
const sellerPw		= Buffer.from( params.sellerPw, "base64").toString('utf8');
const ordNo 		= Buffer.from( params.ordNo, "base64").toString('utf8');
const dlvNo 		= Buffer.from( params.dlvNo, "base64").toString('utf8');
const prdNo			= Buffer.from( params.prdNo, "base64").toString('utf8');
const companyName	= Buffer.from( params.companyName, "base64").toString('utf8');
const invoiceNo		= Buffer.from( params.invoiceNo, "base64").toString('utf8');

//console.log( sellerId );
//console.log( sellerPw );
//console.log( ordNo );
//console.log( dlvNo );
//console.log( prdNo );
//console.log( companyName );
//console.log( invoiceNo );





// 딜레이를 주기 위한 함수
function delay( timeout )
{
  return new Promise(( resolve ) => {
    setTimeout( resolve, timeout );
  });
}//	end	function delay( timeout )

// puppeteer.executablePath()는 설치한 puppeteer 노드모듈의 번들로 제공되는 chromium 브라우저의 경로의 주소값을 가진다.
// 해당 예제는 puppeteer.launch를 통해 퍼펫티어를 실행할때 해당 경로의 값을 지정한다.
//	console.log(puppeteer.executablePath());


puppeteer.launch({

		 headless : false        									// 헤드리스모드의 사용여부를 묻는다
		, devtools : true      										// 브라우저의 개발자 모드의 오픈 여부를 묻는다
		
        , executablePath : puppeteer.executablePath()   			// 실행할 chromium 기반의 브라우저의 실행 경로를 지정한다.
        , ignoreDefaultArgs : false     							// 배열이 주어진 경우 지정된 기본 인수를 필터링한다.(중요 : true사용금지)
        , timeout : 30000       									// 브라우저 인스턴스가 시작될 때까지 대기하는 시간(밀리 초)
        , defaultViewport : { width : 1920 , height : 1000 }       	// 실행될 브라우저의 화면 크기를 지정한다.
        , args : [ '--no-sandbox', '--disable-setuid-sandbox' ]

}).then(async browser => {

        const page = await browser.newPage();

        // 새탭을 열고 작업을 수행할 페이지를 지정한다.
        await page.goto( "https://spc.tmon.co.kr/member/login?return_url=%2F", { waitUntil : "networkidle2" } );

        // 딜레이를 준다.
        await delay(1000);
        //await page.screenshot( { path : "img_" + ( new Date().getTime() / 1000  ) + ".png" } );

        await page.type( "#form_id", sellerId );
        await page.type( "#form_password", sellerPw );

        // 딜레이를 준다.
        ///await delay(1000);
        let elementHandle1 = await page.waitFor( ".btn" );
        await elementHandle1.press( "Enter" );


        //await page.screenshot( { path : "img_" + ( new Date().getTime() / 1000  ) + ".png" } );

        // 딜레이
        await delay(2000);

        //await page.screenshot( { path : "img_" + ( new Date().getTime() / 1000  ) + ".png" } );

        const cookies = await page.cookies();

        let LoginPartnerSrl = "";
        let loopCnt1 = 0;
        for(loopCnt1=0; cookies.length>loopCnt1; loopCnt1++)
        {
                if(cookies[loopCnt1].name == 'LoginPartnerSrl')
                {
                        LoginPartnerSrl = cookies[loopCnt1].value;
                }// end if

        }// end for
		

		let NextUrl_1	=	"https://spc.tmon.co.kr/delivery?deliveryStatus=ALL&delay=N";
		await page.goto( NextUrl_1 , { waitUntil : "networkidle2" } );
		
		let NextUrl_2	=	"https://spc.tmon.co.kr/delivery/invoiceList";
			NextUrl_2	=	NextUrl_2 + "?main_buy_srls=" + ordNo;
			NextUrl_2	=	NextUrl_2 + "&main_deal_srls=" + prdNo;
			
		await page.goto( NextUrl_2 , { waitUntil : "networkidle2" } );		


		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
		let html_data = await page.$("#register > fieldset > table > tbody > tr > td:nth-child(6) > div > p");
		
		if( html_data !== null )
		{
			let evalData = await page.evaluate(element => {
				return element.textContent;
			}, html_data);
			console.log(evalData);

			if( evalData == "배송상태 : 배송 중" )
			{
				const result_img_save_path = "E:\\node_source\\downLoad\\tmon_" + sellerId + "_" + ordNo + "_" + invoiceNo + ".png";
				//const result_img_save_path = "/home/btsutil/public_html/tmon/reg_develivery_doc_result/tmon_" + sellerId + "_" + ordNo + "_" + invoiceNo + ".png";
				await page.screenshot( { path : result_img_save_path } );
				
				await delay(1000);	// 딜레이를 준다.
				// 브라우져 종료
				await browser.close();
				
				var arr_return	=	new Array();

					var data = new Object();
						data.resultPath = result_img_save_path;

					arr_return.push(data)


				var jsonData = JSON.stringify(arr_return) ;

				console.log( jsonData );	
			
			}//	end if
		}else{
			//	@nothing
		}//	end if

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		
		await delay(1000);	// 딜레이를 준다.
		await page.click( "#register > fieldset > table > thead > tr > th:nth-child(1) > label > i" );
        await delay(1000);	// 딜레이를 준다.
		

		const Handlers_selectBox = await page.$x("//select");
		if (Handlers_selectBox.length > 0)
		{
          await Handlers_selectBox[0].focus();
		  await delay(1000);	// 딜레이를 준다.
		  await Handlers_selectBox[0].select( "자체배송" );
		  await delay(1000);	// 딜레이를 준다.
		  
		  console.log( params.companyName );
		  
		  //await Handlers_selectBox[0].select( params.companyName );
		  await delay(1000);	// 딜레이를 준다.
		  
		  
		  await Handlers_selectBox[0].click();
		  await delay(1000);	// 딜레이를 준다.
		  await Handlers_selectBox[0].select( companyName );
		  
		} else {
		  throw new Error("select box not found");
		}//	end if



		const Handlers_inputBox = await page.$x("//input");
		console.log( Handlers_inputBox.length );
		
		let loopCnt_1		=	0;
		let elementType		= 	"";
		let elementValue	=	"";
		for( loopCnt_1=0; Handlers_inputBox.length>loopCnt_1; loopCnt_1++ )
		{
			elementType		= 	"";
			elementType		=	await page.evaluate(element => element.getAttribute('type'), Handlers_inputBox[loopCnt_1]);
			elementValue	=	await page.evaluate(element => element.getAttribute('value'), Handlers_inputBox[loopCnt_1]);
			if( elementType == 'text' )
			{	
				await Handlers_inputBox[loopCnt_1].click();
				await Handlers_inputBox[loopCnt_1].focus();
				
				await page.keyboard.down('Control');
				await page.keyboard.press('KeyA');
				await page.keyboard.up('Control');
				await page.keyboard.press('Backspace');
				await delay(1000);	// 딜레이를 준다.

				await Handlers_inputBox[loopCnt_1].type( invoiceNo );
				await delay(1000);	// 딜레이를 준다.
				
				await Handlers_inputBox[loopCnt_1].press( "Enter" );
			}//	end if
			
		}//	end for

		await delay(1000);	// 딜레이를 준다.
		await page.click( "#invoiceNew > div.layer_ct.ct_track > div.btn_area.center > button.btn.submit2" );
		await delay(1000);	// 딜레이를 준다.
		
		
		const result_img_save_path = "E:\\node_source\\downLoad\\tmon_" + sellerId + "_" + ordNo + "_" + invoiceNo + ".png";
		//const result_img_save_path = "/home/btsutil/public_html/tmon/reg_develivery_doc_result/tmon_" + sellerId + "_" + ordNo + "_" + invoiceNo + ".png";
		await page.screenshot( { path : result_img_save_path } );
		
		await delay(1000);	// 딜레이를 준다.
        // 브라우져 종료
        await browser.close();
		
		var arr_return	=	new Array();

			var data = new Object();
				data.resultPath = result_img_save_path;

			arr_return.push(data)


		var jsonData = JSON.stringify(arr_return) ;

		console.log( jsonData );		

		///////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////
		
});



/**/
