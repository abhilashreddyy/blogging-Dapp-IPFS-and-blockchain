
pragma solidity ^0.4.16;




contract blog {
    // Model a Candidate
    struct user {
        string name;
        //address publickey;
        string mobile;
        //mapping(string => blog_details) blogs;
        //string blog_hash;
        string[] blog_hash;
        int8 flag ;
        //uint num_blogs;
    }
    struct blog_details{
        uint date_created;
        uint date_modified;
        string hash;
    }
    uint public num_users;
    event blog_added (uint number);
    mapping (address => user) users ;
    function add_user(string curr_name,string curr_mobile,string curr_blog_hash) public {
        if(users[msg.sender].flag == 1){
          users[msg.sender].blog_hash[users[msg.sender].blog_hash.length++] = curr_blog_hash;
        }
        if (users[msg.sender].flag == 0){
          num_users = num_users + 1;
          string[]  curr_hash;
          curr_hash[curr_hash.length++] = curr_blog_hash;
          users[msg.sender] = user(curr_name,curr_mobile,curr_hash,1);
        }

        emit blog_added(num_users);

    }
    function number_users() public view returns(uint){
      return num_users+1;
    }

    function say_hello() public pure returns(string){
        return "hello worlddd";
    }

    function read_blog() public view returns(bytes serialized){
        uint startindex = 0;
        uint endindex = users[msg.sender].blog_hash.length;
        string[] arr = users[msg.sender].blog_hash;
        require(endindex >= startindex);

        if(endindex > (arr.length - 1)){
            endindex = arr.length - 1;
        }

        //64 byte is needed for safe storage of a single string.
        //((endindex - startindex) + 1) is the number of strings we want to pull out.
        uint offset = 64*((endindex - startindex) + 1);

        bytes memory buffer = new  bytes(offset);
        string memory out1  = new string(32);


        for(uint i = startindex; i <= endindex; i++){
            out1 = arr[i];

            stringToBytes(offset, bytes(out1), buffer);
            offset -= sizeOfString(out1);
        }

        return (buffer);
    }
    function sizeOfString(string _in) internal pure  returns(uint _size){
        _size = bytes(_in).length / 32;
         if(bytes(_in).length % 32 != 0)
            _size++;

        _size++; // first 32 bytes is reserved for the size of the string
        _size *= 32;
    }
    function stringToBytes(uint _offst, bytes memory _input, bytes memory _output) internal {
        uint256 stack_size = _input.length / 32;
        if(_input.length % 32 > 0) stack_size++;

        assembly {
            let index := 0
            stack_size := add(stack_size,1)//adding because of 32 first bytes memory as the length
        loop:

            mstore(add(_output, _offst), mload(add(_input,mul(index,32))))
            _offst := sub(_offst , 32)
            index := add(index ,1)
            jumpi(loop , lt(index,stack_size))
        }
    }
}
