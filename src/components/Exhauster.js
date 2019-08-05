import React from "react";
import {connect} from "react-redux";
import {
    closeExhauster,
    addExhaustedFeatures,
    submitExhaustedFeature,
    deleteExhaustedFeature,
    changeExhaustedFeatureProperty, initExhaustedFeatures, removePropertyFromFeature
} from "../actions/Actions";
import './Exhauster.css';
import MaterialIcon from "@material/react-material-icon";
import Button from "@material/react-button";
import ExhausterFeature from "./ExhausterFeature";



class Exhauster extends React.Component {
    componentDidMount() {
       this.initiated = false;
       this.exhausterEmpty = false;
       this.offset = 0;
    }

    componentDidUpdate(prevProps) {
        if (this.props.config && !this.initiated) {
            this.resetView();
        }
        if (this.props.config && this.initiated && this.props.features.length <= 10) {
            if (!this.exhausterEmpty) {
                //TODO: implement lazy loading and infinite scroll
                // this.loadFeatures(20)
            }
        }
        window.$('[data-toggle="tooltip"]').tooltip();

    }

    loadFeatures(limit) {
        fetch(`${this.props.config.exhauster.url}/?limit=${limit}&offset=${this.offset}`, {
            method: 'GET'
        })
            .then(res => res.json()).then(res => {
            this.initiated = true;
            this.offset = this.offset + limit;
            if (res.features.length <= 0) {
                this.exhausterEmpty = true;
            } else {
                this.props.addFeatures(res.features);
                this.exhausterEmpty = false;
            }
        });
    }

    resetView() {
        if (this.initiated) {
            this.props.initFeatures([]);
        }

        fetch(`${this.props.config.exhauster.url}/?limit=20&offset=0`, {
            method: 'GET'
        }).then(res => {

            return res.json();
        }).then(res => {
            this.initiated = true;
            this.props.initFeatures(res.features);
            this.offset = 20;
        });

    }

    render() {
        return(
            <div>
                <h6>The following features were not imported due database type collisions. Please correct and submit features, or dismiss them completly.</h6>
                <Button
                    outlined="true"
                    icon={<MaterialIcon icon="refresh" />}
                    onClick={() => this.resetView()}>Refresh</Button>
                <h5 className={ this.props.features.length <= 0 ? "" : "show-no-features" }>No Import Error occurred</h5>
                {this.props.features.map((f) => <ExhausterFeature feature={f} />)}
            </div>


        )
    }
}

const mapDispatchToProps = dispatch => ({
    closeExhauster: () => dispatch(closeExhauster()),
    addFeatures: (features) => dispatch(addExhaustedFeatures(features)),
    initFeatures: (features) => dispatch(initExhaustedFeatures(features)),
    deleteFeature: (feature) => dispatch(deleteExhaustedFeature(feature._id.$oid)),
    submitFeature: (feature) => dispatch(submitExhaustedFeature(feature._id.$oid)),
    changeFeature: (feature, key, value) => dispatch(changeExhaustedFeatureProperty(feature._id.$oid, key, value)),
    removeProperty: (id, key) => dispatch(removePropertyFromFeature(id, key))
});


const mapStateToProps = state => ({
    modal: state.modal,
    features: state.exhausted_features,
    config: state.config
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Exhauster);

