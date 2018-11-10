
pragma solidity ^0.4.16;




contract blog {
    // Model a Candidate
    struct user {
        string name;
        //address publickey;
        string mobile;
        //mapping(string => blog_details) blogs;
        //string blog_hash;
        bytes32[] blog_hash;
        int8 flag ;
        mapping(bytes32 => uint256) hash_index;
        //uint num_blogs;
    }
    struct blog_details{
        uint date_created;
        uint date_modified;
        string hash;
    }
    uint public num_users;

    event blog_added (uint number);
    mapping (address => user) public users ;
    function add_user(string curr_name,string curr_mobile,bytes32 curr_blog_hash) public {
        if(users[msg.sender].flag == 1){
          users[msg.sender].blog_hash.push(curr_blog_hash);
        }
        else{

          bytes32[] curr_hash;
          num_users++;

          curr_hash.push(curr_blog_hash);

          users[msg.sender] = user(curr_name,curr_mobile,curr_hash,1);
        }
        users[msg.sender].hash_index[curr_blog_hash] = users[msg.sender].blog_hash.length;

        emit blog_added(num_users);
    }

    function edit_blog(bytes32 old_hash,bytes32 new_hash) public {
        uint256 curr_ind = users[msg.sender].hash_index[old_hash];
        users[msg.sender].blog_hash[curr_ind-1] = new_hash;
        delete users[msg.sender].hash_index[old_hash];
        users[msg.sender].hash_index[new_hash] = curr_ind;
    }

    function number_users(bytes32 old_hash) public view returns(uint256){
        uint256 curr_ind = users[msg.sender].hash_index[old_hash];
        return curr_ind;
    }

    function number_users() public view returns(uint){
      return num_users+1;
    }

    function say_hello() public pure returns(string){
        return "hello worlddd";
    }

    function read_blog() public view returns(bytes32[]){
        return users[msg.sender].blog_hash;
    }



}
