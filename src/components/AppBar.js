import React from 'react';
import './AppBar.css';
import TopAppBar, {TopAppBarRow, TopAppBarSection, TopAppBarTitle, TopAppBarIcon} from "@material/react-top-app-bar";
import MaterialIcon from "@material/react-material-icon";
import {
    hideBaselayer,
    openExhauster,
    showBaselayer,
    startUploads,
    turnDarkModeOff,
    turnDarkModeOn
} from "../actions/Actions";
import {connect} from "react-redux";

class AppBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {darkMode: true, baseLayer: true};
    }

    toggleDarkMode = () => {
        if (this.state.darkMode) {
            this.setState({darkMode: false});
            this.props.turnOffDarkMode();
        } else {
            this.setState({darkMode: true});
            this.props.turnOnDarkMode();
        }
    };

    toggleBaselayer = () => {
        if (this.state.baseLayer) {
            this.setState({baseLayer: false});
            this.props.hideBaselayer();
        } else {
            this.setState({baseLayer: true});
            this.props.showBaselayer();
        }
    };

    triggerFilepick = () => {
        document.getElementById("filepicker").click();
    };

    uploadFiles = (e) => {
        const files = e.target.files;
        this.props.startUploads(files);
        e.target.value = "";
    };

    render() {
        return (
            <TopAppBar>
                <input type="file" id="filepicker" className={"hidden-input"} onChange={this.uploadFiles} multiple />
                <TopAppBarRow>
                    <TopAppBarSection align='start'>
                        <TopAppBarIcon navIcon tabIndex={0}>
                            <MaterialIcon hasRipple icon='menu' onClick={() => console.log('click')}/>
                        </TopAppBarIcon>
                        <TopAppBarTitle>Tank Navigator</TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection align='end'>
                        <TopAppBarIcon actionItem>
                            <MaterialIcon
                                aria-label="Upload File"
                                hasRipple
                                icon='cloud_upload'
                                onClick={() => this.triggerFilepick()}
                            />
                        </TopAppBarIcon>
                        <TopAppBarIcon actionItem>
                            <MaterialIcon
                                aria-label="Show Feature Import Errors"
                                hasRipple
                                icon='error'
                                onClick={() => this.props.openExhauster()}
                            />
                        </TopAppBarIcon>
                        <TopAppBarIcon actionItem>
                            <MaterialIcon
                                aria-label="Hide/Show Baselayer"
                                hasRipple
                                icon='layers'
                                onClick={() => this.toggleBaselayer()}
                            />
                        </TopAppBarIcon>
                        <TopAppBarIcon actionItem>
                            <MaterialIcon
                                aria-label="print page"
                                hasRipple
                                icon='brightness_medium'
                                onClick={() => this.toggleDarkMode()}
                            />
                        </TopAppBarIcon>
                    </TopAppBarSection>

                </TopAppBarRow>
            </TopAppBar>


        )
    }
}

const mapDispatchToProps = dispatch => ({
    turnOnDarkMode: () => dispatch(turnDarkModeOn()),
    turnOffDarkMode: () => dispatch(turnDarkModeOff()),
    startUploads: (files) => dispatch(startUploads(files)),
    openExhauster: () => dispatch(openExhauster()),
    hideBaselayer: () => dispatch(hideBaselayer()),
    showBaselayer: () => dispatch(showBaselayer())
});


const mapStateToProps = (state) => ({
    baselayer: state.baselayer
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppBar);