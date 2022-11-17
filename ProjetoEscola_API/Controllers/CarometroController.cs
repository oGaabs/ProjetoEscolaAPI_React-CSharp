using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjetoEscola_API.Data;
using ProjetoEscola_API.Models;

using Microsoft.AspNetCore.Authorization;

namespace ProjetoEscola_API.Controllers
{
    //[Route("api/[controller]/[action]")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CarometroController : ControllerBase
    {
        private EscolaContext _context;

        public CarometroController(EscolaContext context)
        {
            // construtor
            _context = context;
        }

        [ActionName("aluno")]
        [HttpGet]
        public ActionResult<List<Aluno>> GetAluno()
        {
            return _context.Aluno.ToList();
        }

        [ActionName("curso")]
        [HttpGet]
        public ActionResult<List<Curso>> GetCurso()
        {
            return _context.Curso.ToList();
        }
    }
}
