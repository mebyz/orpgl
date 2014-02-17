#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <noise/noise.h>
#include "noiseutils.h"

using namespace std;
using namespace noise;

int main (int argc, char** argv) {

  // load modules
  module::RidgedMulti mountainTerrain;
  module::Billow baseFlatTerrain;
  module::ScaleBias flatTerrain;
  module::Perlin terrainType;
  module::Select finalTerrain;

  // load utils
  utils::NoiseMap heightMap;
  utils::NoiseMapBuilderPlane heightMapBuilder;      
  utils::RendererImage renderer;
  utils::Image image;
  utils::WriterBMP writer;
  
  // base flat terrain (module Billow)
  baseFlatTerrain.SetFrequency (2.0);
  flatTerrain.SetSourceModule (0, baseFlatTerrain);
  flatTerrain.SetScale (0.125);  
  flatTerrain.SetBias (-0.75);

  // get user arguments
  int tilesidelenght = atoi(argv[1]);
  int tilexnumber = atoi(argv[2]);

  // terrain type (module Perlin)
  terrainType.SetFrequency (10.0);
  terrainType.SetPersistence (0);

  // terrain source composer (module Select)
  finalTerrain.SetSourceModule (0, flatTerrain);
  finalTerrain.SetSourceModule (1, mountainTerrain);
  finalTerrain.SetControlModule (terrainType);
  finalTerrain.SetEdgeFalloff (1.25);

  // set builder source
  heightMapBuilder.SetSourceModule (finalTerrain);
  heightMapBuilder.SetDestNoiseMap (heightMap);
  heightMapBuilder.SetDestSize (tilesidelenght,tilesidelenght);

  for (int i = 0; i < tilexnumber; ++i) {
    for (int j = 0; j < tilexnumber; ++j) {
      std::stringstream si;
      std::stringstream sj;
      si << i;
      sj << j;
      
      float rx=3*(i-0.00);
      float rl=3*(i+1.00);
      float ry=3*(j-0.00);
      float rh=3*(j+1.00);

      heightMapBuilder.SetBounds (rx,rl,ry,rh);
      heightMapBuilder.Build ();

      renderer.SetSourceNoiseMap (heightMap);
      renderer.SetDestImage (image);

      std::string result = renderer.Render ();

      std::string ss = std::string("images/tile_")+ si.str() +std::string("_") + sj.str() + std::string(".bmp");

      writer.SetSourceImage (image);
      writer.SetDestFilename(ss);
      writer.WriteDestFile ();
    }
  }
  return 0;
}