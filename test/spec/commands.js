describe('Commands:', function() {
  beforeEach(function() {
    this.Commands = _.clone(Backbone.Radio.Commands);
    spy(this.Commands, 'command');
    spy(this.Commands, 'comply');
    spy(this.Commands, 'complyOnce');
    spy(this.Commands, 'stopComplying');
  });

  describe('when commanding an action that has no handler', function() {
    beforeEach(function() {
      this.Commands.command('handlerDoesNotExist');
    });

    it('should return the Commands object itself.', function() {
      expect(this.Commands.command)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    describe('but has a "default" handler', function() {
      beforeEach(function() {
        this.callback = stub();

        this.Commands.comply('default', this.callback);
        this.Commands.command('handlerDoesNotExist', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the "default" handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('handlerDoesNotExist', 'argOne', 'argTwo');
      });
    });
  });

  describe('when commanding an action that has a handler', function() {
    beforeEach(function() {
      this.callback = stub();
    });

    describe('and no context', function() {
      beforeEach(function() {
        this.Commands.comply('myCommand', this.callback);
        this.Commands.command('myCommand', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should return the instance of Commands from `command`.', function() {
        expect(this.Commands.command).to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `comply`', function() {
        expect(this.Commands.comply)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });

      it('should call be called with Commands as the context', function() {
        expect(this.callback).to.have.always.been.calledOn(this.Commands);
      });
    });

    describe('and a context', function() {
      beforeEach(function() {
        this.context = {};
        this.Commands.comply('myCommand', this.callback, this.context);
        this.Commands.command('myCommand', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should return the instance of Commands from `command`.', function() {
        expect(this.Commands.command).to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `comply`', function() {
        expect(this.Commands.comply)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });

      it('should be called with the correct context', function() {
        expect(this.callback).to.have.always.been.calledOn(this.context);
      });
    });
  });

  describe('when commanding an action multiple times that has a handler', function() {
    beforeEach(function() {
      this.callback = stub();

      this.Commands.comply('myCommand', this.callback);
      this.Commands.command('myCommand');
      this.Commands.command('myCommand');
      this.Commands.command('myCommand');
    });

    it('should always return Commands from `command`.', function() {
      expect(this.Commands.command)
        .to.have.been.calledThrice
        .and.to.have.always.returned(this.Commands);
    });

    it('should always return the instance of Commands from `comply`', function() {
      expect(this.Commands.comply)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallback = stub();
        this.Commands.comply('default', this.defaultCallback);
        this.Commands.command('myCommand');
      });

      it('should not call the "default" handler', function() {
        expect(this.defaultCallback).to.have.not.been.called;
      });
    });
  });

  describe('when commanding an action multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.callback = stub();

      this.Commands.complyOnce('myCommand', this.callback);
    });

    describe('and has no "default" handler', function() {
      beforeEach(function() {
        this.Commands.command('myCommand', 'argOne', 'argTwo');
        this.Commands.command('myCommand', 'argOne');
        this.Commands.command('myCommand', 'argTwo');
      });

      it('should call the handler just once, passing the arguments.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should always return the instance of Commands from `command`.', function() {
        expect(this.Commands.command)
          .to.have.been.calledThrice
          .and.to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `complyOnce`', function() {
        expect(this.Commands.complyOnce)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallback = stub();

        this.Commands.comply('default', this.defaultCallback);
        this.Commands.command('myCommand', 'argOne', 'argTwo');
        this.Commands.command('myCommand', 'argOne');
        this.Commands.command('myCommand', 'argTwo');
      });

      it('should call the "default" handler for subsequent calls', function() {
        expect(this.defaultCallback)
          .to.have.been.calledTwice
          .and.calledAfter(this.callback)
          .and.calledWithExactly('myCommand', 'argOne')
          .and.calledWithExactly('myCommand', 'argTwo');
      });
    });
  });

  describe('when commanding an action with a `once` handler with the context set', function() {
    beforeEach(function() {
      this.context = {};
      this.callback = stub();

      this.Commands.complyOnce('myCommand', this.callback, this.context);
      this.Commands.command('myCommand', 'argOne', 'argTwo');
    });

    it('should call the handler just once, passing the arguments.', function() {
      expect(this.callback)
        .to.have.been.calledOnce
        .and.calledWithExactly('argOne', 'argTwo');
    });

    it('should always return the instance of Commands from `complyOnce`', function() {
      expect(this.Commands.complyOnce)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    it('should always be called with the right context', function() {
      expect(this.callback).and.to.have.always.been.calledOn(this.context);
    });
  });

  describe('when unregistering a handler from an object with no commands handlers', function() {
    beforeEach(function() {
      this.stopComplying = _.partial(this.Commands.stopComplying, 'myCommand');
    });

    it('should not throw an Error.', function() {
      expect(this.stopComplying).to.not.throw(Error);
    });
  });

  describe('when calling stopComplying from a Commands instance', function() {
    beforeEach(function() {
      this.commandOne = stub();
      this.commandTwo = stub();
      this.Commands.comply('commandOne', this.commandOne);
      this.Commands.comply('commandTwo', this.commandTwo);
    });

    describe('and passing a name', function() {
      beforeEach(function() {
        this.Commands.stopComplying('commandOne');
      });

      it('should remove the specified handler', function() {
        expect(this.Commands._commands).to.not.contain.keys('commandOne');
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });

    describe('and not passing any arguments', function() {
      beforeEach(function() {
        this.Commands.stopComplying();
      });

      it('should remove all of the handlers', function() {
        expect(this.Commands._commands).to.be.undefined;
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });
  });

  describe('when calling `command` with object', function() {
    beforeEach(function() {
      this.Commands.command({
        commandOne: 'argOne',
        commandTwo: 'argTwo'
      });
    });

    it('should return `this`', function() {
      expect(this.Commands.command).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.command)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', 'argOne')
        .and.calledWith('commandTwo', 'argTwo');
    });
  });

  describe('when calling `comply` with object', function() {
    beforeEach(function() {
      this.commandOneStub = stub();
      this.commandTwoStub = stub();

      this.context = {};

      this.Commands.comply({
        commandOne: this.commandOneStub,
        commandTwo: this.commandTwoStub
      }, this.context);
    });

    it('should return `this`', function() {
      expect(this.Commands.comply).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.comply)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', this.commandOneStub, this.context)
        .and.calledWith('commandTwo', this.commandTwoStub, this.context);
    });
  });

  describe('when calling `complyOnce` with object', function() {
    beforeEach(function() {
      this.commandOneStub = stub();
      this.commandTwoStub = stub();

      this.context = {};

      this.Commands.complyOnce({
        commandOne: this.commandOneStub,
        commandTwo: this.commandTwoStub
      }, this.context);
    });

    it('should return `this`', function() {
      expect(this.Commands.complyOnce).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.complyOnce)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', this.commandOneStub, this.context)
        .and.calledWith('commandTwo', this.commandTwoStub, this.context);
    });
  });

  describe('when calling `stopComplying` with object', function() {
    beforeEach(function() {
      this.Commands.stopComplying({
        commandOne: null,
        commandTwo: null
      });
    });

    it('should return `this`', function() {
      expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.stopComplying)
        .to.have.been.calledThrice
        .and.calledWith('commandOne')
        .and.calledWith('commandTwo');
    });
  });
});
