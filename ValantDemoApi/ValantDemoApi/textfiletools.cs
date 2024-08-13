using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ValantDemoApi
{
  public class textfiletools
  {
    public string getTextContet(string filename)
    {

      string filePath = Path.Combine(Directory.GetCurrentDirectory(), "librarymaze", filename);
      string textContent = "";

      try
      {
        using StreamReader reader = new(filePath);
        textContent = reader.ReadToEnd();

      }
      catch (IOException e)
      {
        //Console.WriteLine("Error: The file couldn´t be readed");
        //Console.WriteLine(e.Message);
      }
      return textContent;
    }

    public List<string> GetFilesList(string foldername = "librarymaze")
    {
      string folderPath = Path.Combine(Directory.GetCurrentDirectory(), foldername);
      List<string> retList = new List<string>();

      if (!Directory.Exists(folderPath))
      {
        // The doesn't directory exists
        Console.WriteLine(String.Format("Error: the directory {0} doesn´t exists", folderPath));
        CreateDirectory(folderPath);
        return retList;
      }

      foreach (string file in Directory.EnumerateFiles(folderPath, "*.txt"))
      {
        retList.Add(file.Replace(folderPath + "\\", ""));
        //string contents = File.ReadAllText(file);
      }
      return retList;
    }

    private bool CreateDirectory(string path)
    {
      try
      {
        // Determine whether the directory exists.
        if (Directory.Exists(path))
        {
          Console.WriteLine("That path exists already.");
          return true;
        }

        // Try to create the directory.
        DirectoryInfo di = Directory.CreateDirectory(path);
        Console.WriteLine("The directory was created successfully at {0}.", Directory.GetCreationTime(path));
        return true;
        //// Delete the directory.
        //di.Delete();
        //Console.WriteLine("The directory was deleted successfully.");
      }
      catch (Exception e)
      {
        Console.WriteLine("The process failed: {0}", e.ToString());
        return false;
      }
    }
  }
}
