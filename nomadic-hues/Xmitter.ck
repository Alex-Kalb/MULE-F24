public class Xmitter
{
  // send objects
  OscSend backing[16];
  // number of targets (initialized by init)
  int num_targets;
  // port
  6449 => int port;

  // default values, set actual values based on setup in the init function below, 
  // under the else branch
  5 => int NUM_IN_FRONT;
  6 => int NUM_IN_BACK;
  5 => int NUM_BASS;
  int bassIndexes[NUM_BASS];

  fun void init(string arg)
  {
    if (arg == "local" || arg == "l" || arg == "localhost")
    {
      <<< "Initializing Xmitter for local" >>>;
      1 => num_targets;

      1 => NUM_BASS;
      [0] @=> bassIndexes;
      backing[0].setHost ( "localhost", port );
    } else
    {
      <<< "Initializing Xmitter for non-local" >>>;

      // SETUP CLIENT TARGETS
      15 => num_targets;
      8 => NUM_IN_FRONT;
      7 => NUM_IN_BACK;

      // front section
      backing[0].setHost ( "lasagna.local", port );
      backing[1].setHost ( "omelet.local", port );
      backing[2].setHost ( "pho.local", port );
      backing[3].setHost ( "empanada.local", port );
      backing[4].setHost ( "meatloaf.local", port );
      backing[5].setHost ( "meatloaf.local", port );
      backing[6].setHost ( "meatloaf.local", port );
      backing[7].setHost ( "meatloaf.local", port );


      // back section
      backing[8].setHost ( "quinoa.local", port );
      backing[9].setHost ( "nachos.local", port );
      backing[10].setHost ( "foiegras.local", port );
      backing[11].setHost ( "udon.local", port );
      backing[12].setHost ( "chowder.local", port );
      backing[13].setHost ( "meatloaf.local", port );
      backing[14].setHost ( "meatloaf.local", port );


      // SETUP FOR BASS SYNTH
      // write into the bassIndexes array negative numbers if you want less than
      // NUM_BASS basses (handled as special case by the sendBass function)
      15 => NUM_BASS;
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14] @=> bassIndexes;
    }
  }

  fun int targets()
  {
    return num_targets;
  }

  fun OscSend @ at(int i)
  {
    return backing[i];
  }

  fun int[] basses()
  {
    return bassIndexes;
  }

  fun int front()
  {
    return NUM_IN_FRONT;
  }

  fun int back()
  {
    return NUM_IN_BACK;
  }
}
