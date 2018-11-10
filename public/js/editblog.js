old_hash_1 = $("#hash").val();
old_hash = base58.decode(old_hash_1);
old_hash = base58.to_hex(old_hash);
old_hash = "0x"+old_hash.slice(4,old_hash.length);
const node = new Ipfs()
var hexalphabet = '0123456789abcdefABCDEF';

web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:6789'));
//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:5432'));


console.log("old_hash : ",old_hash);
function get_hash_data(hash){
  node.on('ready', () => {
    node.files.get(hash, function (err, files) {
      files.forEach((file) => {
        console.log(file.content.toString('utf8'))
        cont = JSON.parse(file.content);
        cont['_id'] = hash;
        created_date = cont["created"];
        show_content(cont);
      })
    })
  })
}

function show_content(blog){
  $(document).ready(function(){
    $("#title").attr("value",blog.title);
    $("#image").attr("value",blog.image);
    $("#content").html(blog.content);
  })
}
get_hash_data(old_hash_1);


console.log(web3.currentProvider," ",web3.eth.currentProvider);
password = "1220047c3c19"
async function get_accounts(){
  web3.eth.getAccounts().then(console.log);
  all_accs = await web3.eth.getAccounts()
  account = all_accs[params.account_index];
  console.log(account);
}
get_accounts()



$.getJSON("/blog.abi", function(contract_abi) {
  instance = new web3.eth.Contract(contract_abi,
    params.address);

  console.log("hogay");
  instance.events.blog_added({
    // Using an array means OR: e.g. 20 or 23
    fromBlock: "latest"
  },function(error, event){
    console.log("hogaya");
     console.log("event :", event);
     console.log("err : ",error);
  }).on('data', function(event){
      console.log("event : ",event); // same results as the optional callback above
  })
  .on('changed', function(event){
      console.log("event : ",event);
      // remove event from local database
  })
  .on('error', console.error);




})



$("#submit").click(function(){
  content = {
    title : $("#title").val(),
    image : $("#image").val(),
    content : $("#content").val(),
    modified : Date.now(),
    created : created_date
  }
  console.log(content);

  node.files.add(new node.types.Buffer(JSON.stringify(content)), (err, filesAdded) => {
    console.log(account);
    console.log("string : ",String(filesAdded[0].hash));
    plain = base58.decode(filesAdded[0].hash);
    plain = base58.to_hex(plain);
    new_hash = "0x"+plain.slice(4,plain.length);
    console.log(new_hash);

    web3.eth.personal.unlockAccount(account, params.password, 600)
    .then(function(){
      instance.methods.edit_blog(String(old_hash),String(new_hash)).send({from : account,gas: 1000000})
      .on('transactionHash', function(hash){
          console.log("hash :  ",hash);
      })
      .on('receipt', function(receipt){
          console.log(receipt);
          alert("blog successfully added !!!")
      })
      .on("error",console.error)
    })
  })
})
