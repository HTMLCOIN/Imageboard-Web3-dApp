import React, { Component } from 'react';
import socialDapp from '../abis/socialDapp.json'
import Navbar from './Navbar'
import Main from './Main'
import Footer from './Footer'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const projectId = '2IqIFkHHdJB8Mz6yf0gnxi0fAS6';   // <---------- your Infura Project ID

const projectSecret = '3e89edda10587f446e87b2c83b407aee';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
      authorization: auth,
  },
});

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.htmlcoin) {
      window.web3 = new Web3(window.htmlcoin)
      await window.htmlcoin.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Htmlcoin browser detected. You should consider trying Altmasq!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = socialDapp.networks[networkId]
    if(networkData) {
      const dapp = new web3.eth.Contract(socialDapp.abi, networkData.address)
      this.setState({ dapp })
      const imageCount = await dapp.methods.counter().call()
      this.setState({ imageCount })
      // Load images, sort by newest
      for (var i=imageCount; i>=1; i--) {
        const image = await dapp.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      //Set latest image with title to view as default
      const latest = await dapp.methods.images(imageCount).call()
      this.setState({
        currentHash: latest.hash,
        currentTitle: latest.title
      })
      this.setState({ loading: false})
    } else {
      window.alert('socialDapp contract not deployed to detected network.')
    }
  }

  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }


  uploadImage = title => {
    console.log("Submitting file to IPFS...")
    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.dapp.methods.uploadImage(result[0].hash, title).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  changeImage = (hash, title) => {
    this.setState({'currentHash': hash});
    this.setState({'currentTitle': title});
  }

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      dapp: null,
      images: [],
      loading: true,
      currentHash: null,
      currentTitle: null
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.changeImage = this.changeImage.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              images={this.state.images}
              uploadImage={this.uploadImage}
              captureFile={this.captureFile}
              changeImage={this.changeImage}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
            />
        }
        <Footer />
      </div>
    );
  }
}

export default App;
