import React, { Component } from 'react';
import './App.css';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid text-monospace main">
          <br></br>
          &nbsp;
          <br></br>
          <div className="row">
            <div className="col-md-10">
                <img
                  src={`https://ipfs.infura.io/ipfs/${this.props.currentHash}`}
                  controls
                >
                </img>
            <h3 className="mt-3"><b><i className="image-title">{this.props.currentTitle}</i></b></h3>
          </div>
          <div className="vide-feed col-md-2 border border-secondary overflow-auto text-center" style={{ maxHeight: '4000px', minWidth: '175px' }}>
            <h5 className="feed-title"><b>Image Feed 📺</b></h5>
            <form onSubmit={(event) => {
              event.preventDefault()
              const title = this.imageTitle.value
              this.props.uploadImage(title)
            }} >
              &nbsp;
              <input type='file' accept=".jpg, .jpeg, .png" onChange={this.props.captureFile} style={{ width: '250px' }} />
                <div className="form-group mr-sm-2">
                  <input
                    id="imageTitle"
                    type="text"
                    ref={(input) => { this.imageTitle = input }}
                    className="form-control-sm mt-3 mr-3"
                    placeholder="Title.."
                    required />
                </div>
              <button type="submit" className="btn border border-dark btn-primary btn-block btn-sm">Upload</button>
              &nbsp;
            </form>
            { this.props.images.map((image, key) => {
              return(
                  <div className="card mb-4 text-center hover-overlay bg-secondary mx-auto" style={{ width: '195px'}} key={key} >
                    <div className="card-title bg-dark">
                      <small className="text-white"><b>{image.title}</b></small>
                    </div>
                    <div>
                      <p onClick={() => this.props.changeImage(image.hash, image.title)}>
                        <img
                          src={`https://ipfs.infura.io/ipfs/${image.hash}`}
                          style={{ width: '170px' }}
                        />
                      </p>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
