
            /*Read value from input 
            */

            function getData(){
                let input = $('#barcode').val();
                return input;
            }

            /*Matching and returning all barcodes between 8-13 characters
            */

            function processData(data){

                let regex =/[0-9]{8,13}/g;

                let barcodes = data.match(regex);
                return barcodes;

            }

            //Load image

            function loadImg(item){         
                    
                let productDiv = document.createElement('div');
                productDiv.classList.add("col-sm-3", "imagediv");
                productDiv.setAttribute('id',`P${item}`)
                let container = $('#results')[0].appendChild(productDiv);
                
                //Create new image with loading animation then add to productDiv
                
                let img = new Image();        
                img.src = `img/loading2.gif`;
                img.alt = "loading";
                img.id = item;
                
                productDiv.appendChild(img);
                
                //Create barcode below the images then add it to the container

                let barcode = document.createElement('span');
                barcode.setAttribute('id', `B${item}`);
                barcode.innerHTML = `${item}`;
                productDiv.appendChild(barcode);
                if(item.length>=12){
                    barcode.innerHTML = `<svg class='barcode' id='S${item}' ></svg>`;
                    JsBarcode(`#S${item}`, item,{height: "14",displayValue: true});
                } else {
                    barcode.classList.add('barcode');
                }
                                
                //Create promise with even listener for load or error to resolve or reject the promise

                const loadOldSrc = () => {return new Promise(function(resolve, reject){
                    
                    let img2 = new Image();

                    img2.onload = ()=>{
                        resolve(img2);
                    };

                    img2.onerror = (response) => {
                        reject(item);   
                    }

                    // img2.src = `https://static.theworks.co.uk/images/${item}AAA_Z.jpg`;     //this was the old web source
                    img2.src = `http://d2ih8t31foccmk.cloudfront.net/${item}_M.jpg`; 
                    img2.alt = item
                    ;    
                    })};

                const loadNewSrc = ()=> {return new Promise(function(resolve, reject){
                    
                    let img2 = new Image();

                    img2.onload = ()=>{
                        resolve(img2);
                    };

                    img2.onerror = (response) => {
                        reject(item);   //in case of error reject and pass the itemnumber forward
                    }

                   img2.src = `https://www.theworks.co.uk/dw/image/v2/BDXF_PRD/on/demandware.static/-/Sites-master-catalog-tws-uk/default/dw00000000/${item}_Z.jpg?sw=400&sh=400&sm=fit`;
                    img2.alt = item
                    ;    
                    })};
                    
                    //Load old source then if it fails try new source if it fails load "no image available"
                loadOldSrc().then((result)=>{
                    productDiv.replaceChild(result,img);},
                (item)=>{
                    console.log("first promise rejected now trying newsrc for " + item);
                    loadNewSrc(item)
                    .then((result)=>{
                        console.log('newsrc loaded')
                        productDiv.replaceChild(result,img);
                    },(error)=>{console.log(error);
                        img.src = 'img/noimage.png';})
                }).catch((error)=>{
                    console.log(error);
                    img.src = 'img/noimage.png';
                });   
            }



            //Run the processing

            function doMagic(e){
                //clear previous results on update to prevent double entries
                $("#results").html("");

                let data = getData();

                data = processData(data);
                if(data!=null){
                    data.map(loadImg);
                } else {
                    $("#results").html('<div class="col-md-6 warning">Full barcode required</div>')
                }

            };


            //Event Listeners

            /*Listen to change in input
            */

            document.getElementById('barcode').oninput = function(event) {
                doMagic();;
              };

            //Listen to paste

            $("#barcode").bind('paste',(event)=>{
                setTimeout(doMagic
                    ,100);
            });


            //Toggle Scroll to top button
            $(window).scroll(function(event) {
                if($(this).scrollTop()>100){
                    $('.gotop').fadeIn();
                } else {
                    $('.gotop').fadeOut();
                }
            });

            //Scroll to top
            $('.gotop').click(function(){
                $('html').animate({ scrollTop: 0 }, 'slow');
            });