from fabric.api import *
import os

env.hosts = ['civio@178.79.185.196:22000']
env.path = 'web/medicamentalia2.org/public'

# call as: fab deploy
def deploy():
  run("cd %(path)s; git pull origin;" % env)
  run("cd %(path)s; sudo service varnish restart" % env)
