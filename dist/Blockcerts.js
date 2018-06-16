'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _certVerifierJs = require('cert-verifier-js');

var _styles = require('@material-ui/core/styles');

var _Paper = require('@material-ui/core/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _BlockcertsLogo = require('./BlockcertsLogo');

var _BlockcertsLogo2 = _interopRequireDefault(_BlockcertsLogo);

var _Tabs = require('@material-ui/core/Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = require('@material-ui/core/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _CheckCircle = require('@material-ui/icons/CheckCircle');

var _CheckCircle2 = _interopRequireDefault(_CheckCircle);

var _HighlightOff = require('@material-ui/icons/HighlightOff');

var _HighlightOff2 = _interopRequireDefault(_HighlightOff);

var _School = require('@material-ui/icons/School');

var _School2 = _interopRequireDefault(_School);

var _Stepper = require('@material-ui/core/Stepper');

var _Stepper2 = _interopRequireDefault(_Stepper);

var _Step = require('@material-ui/core/Step');

var _Step2 = _interopRequireDefault(_Step);

var _StepLabel = require('@material-ui/core/StepLabel');

var _StepLabel2 = _interopRequireDefault(_StepLabel);

var _StepContent = require('@material-ui/core/StepContent');

var _StepContent2 = _interopRequireDefault(_StepContent);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  wrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 992
  },
  paper: {},
  header: {
    color: 'white',
    paddingTop: 20,
    backgroundColor: '#02112a'
  },
  tab: {
    padding: 20
  },
  stepper: {
    textAlign: 'left'
  },
  stepButtons: {
    marginTop: 20
  },
  stepButton: {
    marginRight: 20
  },
  verifierResult: {
    textAlign: 'center'
  },
  verifierReset: {
    marginTop: 20
  }
};

function TabContainer(props) {
  return _react2.default.createElement(
    _Typography2.default,
    { component: 'div', style: { padding: 8 * 3 } },
    props.children
  );
}

TabContainer.propTypes = {
  children: _propTypes2.default.node.isRequired
};

function getSteps() {
  return ['Parsing issuer keys', 'Comparing hashes', 'Checking Merkle root', 'Checking receipt', 'Checking revoked status', 'Checking authenticity', 'Checking expiration date', 'Success'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'TODO: explain that step.';
    case 1:
      return 'TODO: explain that step.';
    case 2:
      return 'TODO: explain that step.';
    case 3:
      return 'TODO: explain that step.';
    case 4:
      return 'TODO: explain that step.';
    case 5:
      return 'TODO: explain that step.';
    case 6:
      return 'TODO: explain that step.';
    case 7:
      return 'TODO: explain that step.';
  }
}

function setStep(status) {
  switch (status) {
    case 'parsingIssuerKeys':
      return 0;
    case 'comparingHashes':
      return 1;
    case 'checkingMerkleRoot':
      return 2;
    case 'checkingReceipt':
      return 3;
    case 'checkingRevokedStatus':
      return 4;
    case 'checkingAuthenticity':
      return 5;
    case 'checkingExpiresDate':
      return 6;
    case 'success':
      return 7;
  }
}

var Blockcerts = function (_Component) {
  _inherits(Blockcerts, _Component);

  function Blockcerts(props) {
    _classCallCheck(this, Blockcerts);

    var _this = _possibleConstructorReturn(this, (Blockcerts.__proto__ || Object.getPrototypeOf(Blockcerts)).call(this, props));

    _this.state = {
      tab: 0,
      certificateJson: null,
      certificate: null,
      verifierStep: 0,
      verifierStatus: null,
      verifierResult: null
    };
    _this.tabChange = _this.tabChange.bind(_this);
    _this.verifyCertificate = _this.verifyCertificate.bind(_this);
    _this.verifierStepper = _this.verifierStepper.bind(_this);
    _this.verifierNext = _this.verifierNext.bind(_this);
    _this.verifierBack = _this.verifierBack.bind(_this);
    return _this;
  }

  _createClass(Blockcerts, [{
    key: 'componentDidMount',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var response, certificateJson, certificate;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch(this.props.url);

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.json();

              case 6:
                certificateJson = _context.sent;

                this.setState({ certificateJson: certificateJson });
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](0);

                console.error(_context.t0);

              case 13:
                certificate = _certVerifierJs.Certificate.parseJson(this.state.certificateJson);

                this.setState({ certificate: certificate });
                this.verifyCertificate();
                if (!this.state.certificateJson.displayHtml && this.state.tab == 0) {
                  this.setState({ tab: 1 });
                }

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 10]]);
      }));

      function componentDidMount() {
        return _ref.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: 'tabChange',
    value: function tabChange(event, value) {
      this.setState({ tab: value });
    }
  }, {
    key: 'verifyCertificate',
    value: function verifyCertificate() {
      var _this2 = this;

      if (this.state.certificateJson) {
        var verifier = new _certVerifierJs.CertificateVerifier(JSON.stringify(this.state.certificateJson), this.verifierStepper);
        verifier.verify().then(function (result) {
          return _this2.setState({ verifierResult: result });
        }).catch(function (e) {
          return console.error(e);
        });
      }
    }
  }, {
    key: 'verifierStepper',
    value: function verifierStepper(status) {
      var step = setStep(status);
      this.setState({
        verifierStep: step,
        verifierStatus: status
      });
    }
  }, {
    key: 'verifierNext',
    value: function verifierNext() {
      this.setState({ verifierStep: this.state.verifierStep + 1 });
    }
  }, {
    key: 'verifierBack',
    value: function verifierBack() {
      this.setState({ verifierStep: this.state.verifierStep - 1 });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (this.state.certificateJson && this.state.certificate) {
        var tab = this.state.tab;

        var steps = getSteps();
        var verifierStep = this.state.verifierStep;

        return _react2.default.createElement(
          'div',
          { className: this.props.classes.wrapper },
          _react2.default.createElement(
            _Paper2.default,
            { className: this.props.classes.paper, elevation: 4 },
            _react2.default.createElement(
              'div',
              { className: this.props.classes.header },
              _react2.default.createElement(_BlockcertsLogo2.default, null),
              _react2.default.createElement(
                _Tabs2.default,
                {
                  value: tab,
                  onChange: this.tabChange,
                  indicatorColor: 'primary',
                  centered: true
                },
                _react2.default.createElement(_Tab2.default, {
                  label: 'Custom display',
                  icon: _react2.default.createElement(_School2.default, null)
                }),
                _react2.default.createElement(_Tab2.default, {
                  label: 'Standard display',
                  icon: _react2.default.createElement(_School2.default, null)
                }),
                _react2.default.createElement(_Tab2.default, {
                  label: 'Certificate verification',
                  icon: this.state.verifierResult == 'success' ? _react2.default.createElement(_CheckCircle2.default, null) : _react2.default.createElement(_HighlightOff2.default, null)
                })
              )
            ),
            tab === 0 && _react2.default.createElement(
              TabContainer,
              null,
              _react2.default.createElement(
                'div',
                { className: this.props.classes.tab },
                this.state.certificateJson.displayHtml && _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript') } }),
                !this.state.certificateJson.displayHtml && _react2.default.createElement(
                  'div',
                  null,
                  'The certificate has no custom display, please view the standard display.'
                )
              )
            ),
            tab === 1 && _react2.default.createElement(
              TabContainer,
              null,
              _react2.default.createElement('img', { src: this.state.certificate.certificateImage }),
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'title', component: 'h1' },
                this.state.certificate.title
              ),
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'subheading', component: 'h2' },
                this.state.certificate.subtitle
              ),
              _react2.default.createElement(
                _Typography2.default,
                { component: 'p' },
                'Awarded on ',
                this.state.certificateJson.issuedOn.toString(),
                ' to:'
              ),
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'title', component: 'h2' },
                this.state.certificate.name
              ),
              _react2.default.createElement(
                _Typography2.default,
                { component: 'p' },
                this.state.certificate.description
              ),
              _react2.default.createElement('img', { src: this.state.certificate.signatureImage.image }),
              _react2.default.createElement(
                _Typography2.default,
                { component: 'p' },
                this.state.certificate.signatureImage.jobTitle
              )
            ),
            tab === 2 && _react2.default.createElement(
              TabContainer,
              null,
              _react2.default.createElement(
                'div',
                { className: this.props.classes.stepper },
                _react2.default.createElement(
                  _Stepper2.default,
                  {
                    activeStep: verifierStep,
                    orientation: 'vertical' },
                  steps.map(function (label, index) {
                    return _react2.default.createElement(
                      _Step2.default,
                      { key: label },
                      _react2.default.createElement(
                        _StepLabel2.default,
                        null,
                        label
                      ),
                      _react2.default.createElement(
                        _StepContent2.default,
                        null,
                        _react2.default.createElement(
                          _Typography2.default,
                          null,
                          getStepContent(index)
                        ),
                        _react2.default.createElement(
                          'div',
                          { className: _this3.props.classes.stepButtons },
                          verifierStep > 0 && _react2.default.createElement(
                            _Button2.default,
                            {
                              size: 'small',
                              color: 'secondary',
                              className: _this3.props.classes.stepButton,
                              onClick: _this3.verifierBack
                            },
                            'Back'
                          ),
                          verifierStep < steps.length - 1 && _react2.default.createElement(
                            _Button2.default,
                            {
                              size: 'small',
                              color: 'secondary',
                              className: _this3.props.classes.stepButton,
                              onClick: _this3.verifierNext
                            },
                            'Next'
                          )
                        )
                      )
                    );
                  })
                )
              ),
              _react2.default.createElement(
                'div',
                { className: this.props.classes.verifierResult },
                _react2.default.createElement(
                  _Typography2.default,
                  { variant: 'headline', component: 'h3' },
                  this.state.verifierResult === 'success' ? 'Valid certificate' : 'Invalid certificate'
                ),
                _react2.default.createElement(
                  _Typography2.default,
                  { component: 'p' },
                  this.state.verifierResult === 'success' ? 'All the verification steps succedded. This certificate is valid!' : 'Some verification steps did not succeed. This certificate is NOT valid.'
                ),
                _react2.default.createElement(
                  _Button2.default,
                  {
                    className: this.props.classes.verifierReset,
                    variant: 'contained',
                    color: 'primary',
                    onClick: this.verifyCertificate
                  },
                  'Verify again'
                )
              )
            )
          )
        );
      } else {
        return null;
      }
    }
  }]);

  return Blockcerts;
}(_react.Component);

Blockcerts.propTypes = {
  url: _propTypes2.default.string.isRequired
};

exports.default = (0, _styles.withStyles)(styles)(Blockcerts);