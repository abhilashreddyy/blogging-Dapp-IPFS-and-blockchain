//web3Provider = new Web3.providers.HttpProvider('ws://localhost:6789');
web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:6789'));
var hexalphabet = '0123456789abcdefABCDEF';
var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
//web3 = new Web3(web3Provider);
const node = new Ipfs()

password = params.password


$.getJSON("/blog.abi", function(contract_abi) {
  instance = new web3.eth.Contract(contract_abi,
    params.address);
})

//0x1b3afaa6226e8ac9087fe30d8b93ad1957c16d75
web3.eth.getAccounts()
.then(console.log);

web3.eth.getAccounts().then(function(accounts,err){
  web3.eth.personal.unlockAccount(accounts[params.account_index], params.password, 600)
  .then(function(){
    console.log("yooo");
    instance.methods.read_blog().call({from : accounts[params.account_index]},function(err,result){
      if(err){
        console.log("error : ",err);
      }
      else{
        console.log("result : ",result);
        result = result.map(val => "1220" + val.slice(2,val.length));
        console.log("before_encoding : ",result);

        result = result.map(val => base58.strip_invalid(val, hexalphabet));
        console.log("1 : " , result);
        result = result.map(val => base58.from_hex(val));
        console.log("2 : ",result);
        result = result.map(val => base58.encode(val));
        console.log("3 : ",result);

        for(i = 1; i < result.length; i++){
          get_hash_data(result[i])
        }
        //result = result.map(val => base58.encode(String(val)));
        //console.log("after encoding result : ", result);

      }
    })
    console.log("reached");

  })
})

function get_hash_data(hash){
  node.files.get(hash, function (err, files) {
    files.forEach((file) => {
      console.log(file.path)
      console.log(file.content.toString('utf8'))
      cont = JSON.parse(file.content);
      cont['_id'] = hash;
      write_content(cont);
    })
  })
}

function write_content(blog){
  console.log("final ::: ",blog);
  html_add = `<div class = "item"><div class="image"><img src ="${blog.image}" ></div><div class="content"><a class="header" href="/blogs/${blog._id}"> ${blog.title} </a><div class="meta"><span>${Date(blog.created)} </span></div><div class ="description"><p>${blog.content}...</p></div><div class="extra"><a class="ui floated basic violet button" href="/blogs/${blog._id}">Read more<i class = "right chevron icon"></i></a></div></div></div>`;
  $("#parent").append(html_add);
}
