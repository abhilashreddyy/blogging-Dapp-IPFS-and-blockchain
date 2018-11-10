
const node = new Ipfs()
var hexalphabet = '0123456789abcdefABCDEF';

web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:6789'));
//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:5432'));


console.log(web3.currentProvider," ",web3.eth.currentProvider);
password = params.password
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
//
//0x1b3afaa6226e8ac9087fe30d8b93ad1957c16d75
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



  /*vote_event = instance.events.blog_added({fromBlock: 'latest'},
  function(error, event){ console.log("1. ",event); }).on('data', function(event){
   console.log("2. ",event);
  })
  //console.log(vote_event);

  vote_event.watch(function(error, event) {
    console.log("event triggered", event)

    // Reload when a new vote is recorded
    //alert("successfully added")
    //vote_event.stopWatching();
  })*/

})

node.on('ready', () => {
  node.files.add(new node.types.Buffer("hello"), (err, filesAdded) => {

    console.log("files added : ",  filesAdded);
  })
})


$(document).ready(function(){
    $("#submit").click(function(){
        content = {
          title : $("#title").val(),
          image : $("#image").val(),
          content : $("#content").val(),
          created : Date.now()
        }
        console.log(content);

        node.files.add(new node.types.Buffer(JSON.stringify(content)), (err, filesAdded) => {
          console.log(account);
          console.log("string : ",String(filesAdded[0].hash));
          plain = base58.decode(filesAdded[0].hash);
          console.log("decode : ",plain);
          plain = base58.to_hex(plain);
          console.log("to hex : ",plain);
          base16 = "0x"+plain.slice(4,plain.length);
          console.log("base16 : ",base16);
          //console.log(base16);

          web3.eth.personal.unlockAccount(account, params.password, 600)
          .then(function(){
            instance.methods.add_user("asdefsfs","1828374659",String(base16)).send({from : account,gas: 1000000})
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
    });


});
