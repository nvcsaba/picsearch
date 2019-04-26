
            /*Read data from input
            */

            function getData(){
                input = $('#barcode').val();
                return input;
            }


            /*Matching and returning all barcodes between 8-13 characters
            */

            function processData(data){

                let regex =/[0-9]{8,13}/g;

                // matching all barcodes from entered data
                let barcodes = data.match(regex);
                return barcodes;

            }


             /*Create Div to hold product image
             */

            function createElement(data){
                let template = `<div class="col-sm-3 imagediv">
                <img alt="no image available for this barcode" src="https://static.theworks.co.uk/images/${data}_L.jpg">
                <span class="bcode">${data}</span></div>`;

                $('#results').append(template);

            }






            //Load image

            function loadImg(item){

                let productDiv = document.createElement('div');      //Create Div to hold product image & add to page
                productDiv.classList.add("col-md-3", "imagediv");

                let container = $('#results')[0].appendChild(productDiv);


                let img = new Image(200,200);        //Create new image with loading animation then add to productDiv
                img.src = `img/loading2.gif`;
                img.alt = "loading";
                img.id = item;

                let element = container.appendChild(img);
                                                            //Load the the product image asyncronously
                new Promise(function(resolve,reject){
                    let img2 = new Image(200,200);
                    img2.onload = ()=>{
                        resolve(img2);
                    };
                    img2.onerror = (response) => {
                        reject(response);
                    }
                    img2.src = `https://static.theworks.co.uk/images/${item}_L.jpg`;
                    img2.alt = item;

                }).then(function(result){           //on load, replace "loading" animation with product & add barcode

                    img.parentNode.replaceChild(result,img);
                    productDiv.innerHTML += `<span class="bcode">${item}</span>`

                }).catch(function(response){
                    img.src = 'img/noimage.png';
                    productDiv.innerHTML += `<span class="bcode">${item}</span>`
                });
            };


            //Run Processing

            function doMagic(e){
                $("#results").html("");

                let data = getData();

                data = processData(data);
                if(data!=null){
                    data.map(loadImg);
                } else {
                    $("#results").html('<div class="col-md-6 warning">Full barcode required</div>')
                }

            };


            /*Listen to click on submit button
            */

            $('#submit').on('click',function(e){
                e.preventDefault();
                doMagic();
            });

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
