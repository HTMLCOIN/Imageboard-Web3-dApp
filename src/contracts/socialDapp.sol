pragma solidity ^0.8.0;

contract socialDapp {
  uint public counter = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string title;
    address author;
  }

  event Uploaded(
    uint id,
    string hash,
    string title,
    address author
  );

  constructor() public {
  }

  function uploadImage(string memory _iHash, string memory _iTitle) public {
    require(bytes(_iHash).length > 0);
    require(bytes(_iTitle).length > 0);
    require(msg.sender!=address(0));
    counter++;
    images[counter] = Image(counter, _iHash, _iTitle, msg.sender);
    emit Uploaded(counter, _iHash, _iTitle, msg.sender);
  }
}
